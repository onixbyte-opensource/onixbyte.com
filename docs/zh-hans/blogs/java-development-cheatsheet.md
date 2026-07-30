---
title: Java 开发小技巧
tags:
  - java
  - tips
author:
  name: Zihlu Wang
  email: real@zihluwang.me
---

## BigDecimal 对比

在 Java 中对 `BigDecimal` 进行比较需要格外注意，因为 `equals` 和 `compareTo` 的行为并不相同。

### `equals` 与 `compareTo` 的区别

`BigDecimal#equals` 会同时比较**数值**和**标度（scale）**，而 `BigDecimal#compareTo` 仅比较**数值**（忽略标度）。例如：

```java
var a = new BigDecimal("100");     // scale = 0
var b = new BigDecimal("100.00");  // scale = 2

a.equals(b);    // false — 标度不同
a.compareTo(b); // 0     — 数学数值相同

var c = new BigDecimal("200");

a.compareTo(c); // -1（负数）— a 小于 c
c.compareTo(a); //  1（正数）— c 大于 a
```

### 为什么这很重要

当值来自不同来源时，标度不匹配的情况很常见——例如解析用户输入、从数据库（`DECIMAL(10,2)` 列）读取、或接收 JSON 数据。你可能会认为两个值相等，但 `equals` 却说它们不相等。

### 使用建议

- 使用 **`compareTo`** 进行数值相等判断：`a.compareTo(b) == 0`
- 仅在需要「完全相同的表示」（数值和标度都相同）时使用 **`equals`**
- 如果需要在 `equals` 前统一标度，可使用 **`stripTrailingZeros()`**：

  ```java
  a.stripTrailingZeros().equals(b.stripTrailingZeros()); // true
  ```

### 与零比较

避免使用 `==` 或 `.equals(BigDecimal.ZERO)` 来判断是否为零——推荐使用 `compareTo`：

```java
if (value.compareTo(BigDecimal.ZERO) == 0) { ... }
```

## 如何从 BlockingQueue 中获得数据？

- 使用 `take()` 方法可以拿取数据，如果队列中没有数据会阻塞线程，一直等待；
- 使用 `poll()` 方法拿取数据，如果没有数据会返回 `null` ；
- 使用 `poll(long timeout, TimeUnit unit)` 方法拿去数据，将会在 `poll()` 的基础上等待特定的时间，如果时间到了还没有拿到数据则会返回 `null` ；
- 使用 `peek()` 拿取数据，但是这种方式不会将已经拿到的数据从队列中移除。

## Spring Cloud Alibaba 常见问题

### Nacos 在个人文件夹中创建 `nacos` 文件夹怎么办？

添加下面两个 Configuration properties 即可指定 nacos 的存储路径：

- `JM.LOG.PATH`
- `JM.SNAPSHOT.PATH`

### Sentinel 乱拉屎怎么办？

添加 Configuration property `csp.sentinel.log.dir` 即可修改 sentinel 的日志路径。

### 怎么在 JetBrains IntelliJ IDEA 中添加 Configuration Properties 配置？

在 JetBrains IntelliJ IDEA 中，在右上角的运行配置中，点击 **`Edit Configurations…`** ，即可看到配置页面。

点击页面中的 **`Modify options`** 按钮，并在下方附加上的 **`Override configuration properties`** 表格中添加需要重置的配置属性。

## Spring Data JPA 常见问题

### 使用 JPA 分页查询时提示 "Serializing `PageImpl` instances as-is not supported, meaning that there is no guarantee about the stability of the resulting JSON structure" 怎么办？

在应用程序主启动类上添加下面的代码：

```java
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
```

### 使用 JPA 分页查询时查询第一页都没数据是为什么？

JPA 的分页页码是从 0 开始的，请求中的页码数据 = 你实际想查询页码数 - 1。

### 如何避免 N+1 查询问题？

N+1 问题是指 JPA 先执行 1 条查询获取父实体，再为每条父实体的关联执行 N 条额外的子查询。

**检测方法** — 观察日志中是否有大量重复的 SQL 查询，或者配置 `spring.jpa.properties.hibernate.generate_statistics=true` 来发现。

**修复方案：**

| 方式                        | 适用场景                 |
|---------------------------|----------------------|
| `@EntityGraph`            | 声明式，适合为特定实体定制抓取计划    |
| `@Query` 中使用 `JOIN FETCH` | 按查询精细控制              |
| `@BatchSize`              | 将 N+1 降低为 N/k+1，批量加载 |

```java
// 方式一：EntityGraph
@EntityGraph(attributePaths = {"roles", "permissions"})
Optional<User> findById(long id);

// 方式二：JOIN FETCH
@Query("SELECT u FROM User u JOIN FETCH u.roles WHERE u.id = :id")
Optional<User> findByIdWithRoles(@Param("id") long id);
```

### `findById` 与 `getReferenceById` 该用哪个？

- **`findById`** — 立即查询数据库，返回实体或 `Optional.empty()`。需要实际数据时使用。
- **`getReferenceById`** — 返回一个惰性代理（proxy），**不查询数据库**。只有当访问不存在的代理属性时才会抛出 `EntityNotFoundException`。只需要 ID 来设置外键关系时使用。

```java
// 推荐：只需要引用 User 来设置外键
Post post = new Post();
post.setAuthor(userRepository.getReferenceById(userId));
```

### 如何解决 `LazyInitializationException`？

当你在持久化上下文之外（例如 Controller 或序列化器中，事务已关闭后）访问懒加载的关联属性时，就会抛出此异常。

**解决方案：**

1. **使用 `JOIN FETCH` 或 `@EntityGraph`** 提前加载所需的关联数据。
2. **使用 DTO 投影** — 只返回需要的字段，而不是整个实体：

   ```java
   @Query("SELECT new com.example.UserDto(u.id, u.name) FROM User u WHERE u.id = :id")
   UserDto findUserDtoById(@Param("id") long id);
   ```
3. **在 Service 方法上使用 `@Transactional(readOnly = true)`** — 使 Session 在整个方法作用域内保持打开。

### 什么时候该用 `@Transactional(readOnly = true)`？

在**只读**的 Service 方法上使用 `@Transactional(readOnly = true)` 有三个好处：

- Hibernate 会跳过脏检查（无需快照，占用内存更少）。
- JDBC 驱动可能会将请求路由到只读副本。
- 清晰地表达了方法的意图。

```java
@Service
public class UserService {

    @Transactional(readOnly = true)
    public UserDto getUser(long id) { ... }

    @Transactional
    public UserDto createUser(CreateUserRequest request) { ... }
}
```

### `save()` 与 `saveAll()` — 批量插入哪个更快？

`saveAll()` 在单个事务中执行，可以受益于 JDBC 批处理。需要配置批处理大小：

```yaml
spring:
  jpa:
    properties:
      hibernate:
        jdbc:
          batch_size: 20
        order_inserts: true
        order_updates: true
```

对于大量数据的批量插入（数千行），建议改用 `JdbcTemplate` 的批处理操作——在这种规模下 Hibernate 的实体管理开销会非常大。

### 如何用 `Specification` 实现动态查询？

对于带有多个可选筛选条件的复杂搜索表单，使用 `JpaSpecificationExecutor`：

```java
public interface UserRepository extends JpaRepository<User, Long>,
        JpaSpecificationExecutor<User> {
}

// 使用方式
Specification<User> spec = (root, query, cb) -> {
    List<Predicate> predicates = new ArrayList<>();
    if (name != null) {
        predicates.add(cb.like(root.get("name"), "%" + name + "%"));
    }
    if (status != null) {
        predicates.add(cb.equal(root.get("status"), status));
    }
    return cb.and(predicates.toArray(new Predicate[0]));
};

Page<User> page = userRepository.findAll(spec, pageable);
```

## 使用 Jackson 将对象或 Map 平铺到 JSON 中

在序列化 JSON 时，有时需要将嵌套对象的属性"平铺"到父级 JSON 中，而不是作为一个嵌套字段出现。Jackson 提供了两个注解来分别处理对象和 `Map` 的平铺场景。

### `@JsonUnwrapped` — 平铺已知结构的对象

`@JsonUnwrapped` 会将一个嵌套对象的属性直接展开到父级 JSON 中：

```java
public class Address {
    private String street;
    private String city;
    // getters and setters
}

public class User {
    private String name;

    @JsonUnwrapped
    private Address address;
    // getters and setters
}
```

序列化结果：

```json
{
  "name": "陳大文",
  "street": "彌敦道",
  "city": "香港"
}
```

如果不使用 `@JsonUnwrapped`，`address` 会作为一个嵌套 JSON 对象出现：`"address": { "street": "...", "city": "..." }`。

### `@JsonAnyGetter` — 平铺键值不固定的 Map

`@JsonAnyGetter` 可以将 `Map` 中的键值对直接平铺到父级 JSON 中，适合 key 不固定或动态扩展的场景：

```java
public class Product {
    private String name;

    private Map<String, Object> attributes = new HashMap<>();

    @JsonAnyGetter
    public Map<String, Object> getAttributes() {
        return attributes;
    }
    // other getters and setters
}
```

当 `attributes` 包含 `{"colour": "red", "size": "XL"}` 时，序列化结果：

```json
{
  "name": "Example Product",
  "colour": "red",
  "size": "XL"
}
```

注意 `@JsonAnyGetter` 需要加在 **getter 方法**上，而不是字段上；同时需要搭配 `@JsonAnySetter` 来支持反序列化。

### 如何选择

| 场景                                   | 注解               |
|----------------------------------------|--------------------|
| 平铺字段固定的嵌套对象（如地址、配置）   | `@JsonUnwrapped`   |
| 平铺 key 不固定的动态键值对             | `@JsonAnyGetter`   |
