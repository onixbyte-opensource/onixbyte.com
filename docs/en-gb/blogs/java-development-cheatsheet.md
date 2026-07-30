---
title: Java Development Cheatsheet
tags:
  - java
  - tips
author:
  name: Zihlu Wang
  email: real@zihluwang.me
---

## Comparison for `BigDecimal`

In Java, comparing `BigDecimal` values requires care because `equals` and `compareTo` behave differently.

### `equals` vs `compareTo`

`BigDecimal#equals` checks both **value** and **scale**, while `BigDecimal#compareTo` only checks **value** (ignoring scale). This means:

```java
var a = new BigDecimal("100");     // scale = 0
var b = new BigDecimal("100.00");  // scale = 2

a.equals(b);    // false — different scale
a.compareTo(b); // 0     — same mathematical value

var c = new BigDecimal("200");

a.compareTo(c); // -1 (negative) — a is less than c
c.compareTo(a); //  1 (positive) — c is greater than a
```

### Why this matters

The scale mismatch often appears when values come from different sources — e.g., parsing user input, reading from a database (`DECIMAL(10,2)` columns), or receiving JSON payloads. You might think two values are equal when `equals` says they aren't.

### Rule of thumb

- Use **`compareTo`** for numeric equality checks: `a.compareTo(b) == 0`
- Use **`equals`** only when you mean "identical representation" (same value and same scale)
- Use **`stripTrailingZeros()`** if you need to normalise scale before `equals`:

  ```java
  a.stripTrailingZeros().equals(b.stripTrailingZeros()); // true
  ```

### Comparing with zero

Avoid `==` or `.equals(BigDecimal.ZERO)` to check for zero — prefer `compareTo`:

```java
if (value.compareTo(BigDecimal.ZERO) == 0) { ... }
```

## How to Retrieve Data from a BlockingQueue

- `take()` — retrieves and removes the head of the queue, waiting if necessary until an element becomes available.
- `poll()` — retrieves and removes the head of the queue, or returns `null` if the queue is empty.
- `poll(long timeout, TimeUnit unit)` — retrieves and removes the head of the queue, waiting up to the specified wait time if necessary for an element to become available. Returns `null` if the timeout expires.
- `peek()` — retrieves but does not remove the head of the queue. Returns `null` if the queue is empty.

## Spring Cloud Alibaba FAQs

### How to prevent Nacos from creating a `nacos` folder in the user's home directory?

Add the following two configuration properties to specify the Nacos storage path:

- `JM.LOG.PATH`
- `JM.SNAPSHOT.PATH`

### How to deal with Sentinel's scattered log files?

Add the configuration property `csp.sentinel.log.dir` to change Sentinel's log directory.

### How to add Configuration Properties in JetBrains IntelliJ IDEA?

In JetBrains IntelliJ IDEA, click **`Edit Configurations…`** in the run configuration dropdown at the top right.

Click the **`Modify options`** button on the page, then add the properties you need to reset in the **`Override configuration properties`** table that appears below.

## Spring Data JPA FAQs

### How to fix the "Serializing `PageImpl` instances as-is not supported" warning?

Spring Data JPA warns about unstable JSON serialization of `PageImpl`. To resolve this, enable VIA_DTO serialization mode on your application's main class:

```java
@EnableSpringDataWebSupport(pageSerializationMode =
    EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
```

### Why does the first page return no results?

JPA pagination is **zero-indexed**. Page `0` is the first page. If your frontend sends `page=1`, you need to pass `page - 1` to Spring Data:

```java
Pageable pageable = PageRequest.of(requestPage - 1, pageSize);
```

### How to avoid the N+1 query problem?

The N+1 problem occurs when JPA executes one query for the parent entity, then N additional queries for each child association.

**Detection** — look for repetitive SQL queries in the logs, or configure `spring.jpa.properties.hibernate.generate_statistics=true` to spot it.

**Fixes:**

| Approach                 | When to use                                       |
|--------------------------|---------------------------------------------------|
| `@EntityGraph`           | Declarative, good for entity-specific fetch plans |
| `JOIN FETCH` in `@Query` | Fine-grained control per query                    |
| `@BatchSize`             | Reduces N+1 to N/k+1 by batching                  |

```java
// Option 1: EntityGraph
@EntityGraph(attributePaths = {"roles", "permissions"})
Optional<User> findById(long id);

// Option 2: JOIN FETCH
@Query("SELECT u FROM User u JOIN FETCH u.roles WHERE u.id = :id")
Optional<User> findByIdWithRoles(@Param("id") long id);
```

### `findById` vs `getReferenceById` — which one to use?

- **`findById`** — hits the database immediately, returns the entity or `Optional.empty()`. Use this when you need the data.
- **`getReferenceById`** — returns a lazy proxy **without** hitting the database. Throws `EntityNotFoundException` only when you access a non-existent proxy's properties. Use this when you only need the ID to set a foreign key relationship.

```java
// Good: only need the user reference to set a FK
Post post = new Post();
post.setAuthor(userRepository.getReferenceById(userId));
```

### How to fix `LazyInitializationException`?

This happens when you access a lazily-loaded association outside the persistence context (e.g., in a controller or serializer after the transaction has closed).

**Solutions:**

1. **Use `JOIN FETCH` or `@EntityGraph`** to eagerly load needed associations.
2. **Use DTO projections** — return only the fields you need instead of whole entities:

   ```java
   @Query("SELECT new com.example.UserDto(u.id, u.name) FROM User u WHERE u.id = :id")
   UserDto findUserDtoById(@Param("id") long id);
   ```
3. **`@Transactional(readOnly = true)`** on the service method — keep the session open for the entire method scope.

### When should I use `@Transactional(readOnly = true)`?

Use `@Transactional(readOnly = true)` on **read-only** service methods for three benefits:

- Hibernate skips dirty checking (no snapshots, less memory).
- The JDBC driver may route to read replicas.
- It documents the intent clearly.

```java
@Service
public class UserService {

    @Transactional(readOnly = true)
    public UserDto getUser(long id) { ... }

    @Transactional
    public UserDto createUser(CreateUserRequest request) { ... }
}
```

### `save()` vs `saveAll()` — which is faster for batch inserts?

`saveAll()` uses a single transaction and can benefit from JDBC batching. Configure the batch size:

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

For large bulk inserts (thousands of rows), consider `JdbcTemplate` batch operations instead — Hibernate's entity management overhead is significant at that scale.

### How to use dynamic queries with `Specification`?

For complex search forms with optional filters, use `JpaSpecificationExecutor`:

```java
public interface UserRepository extends JpaRepository<User, Long>,
        JpaSpecificationExecutor<User> {
}

// Usage
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

## Flattening Objects or Maps into JSON with Jackson

When serialising to JSON, you sometimes need to "flatten" a nested object's properties into the parent JSON rather than having them appear as a nested field. Jackson provides two annotations for handling objects and `Map` flattening separately.

### `@JsonUnwrapped` — flattening objects with a known structure

`@JsonUnwrapped` expands the properties of a nested object directly into the parent JSON:

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

Serialised output:

```json
{
  "name": "John Doe",
  "street": "Oxford Street",
  "city": "London"
}
```

Without `@JsonUnwrapped`, `address` would appear as a nested JSON object: `"address": { "street": "...", "city": "..." }`.

### `@JsonAnyGetter` — flattening a Map with dynamic keys

`@JsonAnyGetter` flattens a `Map`'s key-value pairs directly into the parent JSON, ideal for dynamic or open-ended fields:

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

With `attributes` containing `{"colour": "red", "size": "XL"}`, the serialised output is:

```json
{
  "name": "Example Product",
  "colour": "red",
  "size": "XL"
}
```

Note that `@JsonAnyGetter` must be placed on the **getter method**, not the field itself. You will also need `@JsonAnySetter` to support deserialisation.

### How to choose

| Scenario                                              | Annotation         |
|-------------------------------------------------------|--------------------|
| Flatten nested objects with fixed fields (e.g. address, config) | `@JsonUnwrapped`   |
| Flatten dynamic key-value pairs with unknown keys     | `@JsonAnyGetter`   |