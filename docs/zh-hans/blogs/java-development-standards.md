---
title: Java 开发规范
tags:
  - java
  - spring-boot
  - standards
  - best-practice
  - backend
author:
  name: Zihlu Wang
  email: real@zihluwang.me
---

## Java 语言与编码风格

- **Java 版本**: 项目所使用的 JDK 应当在可能的情况下，使用最新的 LTS 版本。
- **命名约定**:
  - 类: 帕斯卡命名法 (`PascalCase`) (例如，`UserService`, `OrderController`)。
  - 方法: 驼峰命名法 (`camelCase`) (例如，`getUserById`, `saveOrder`)。
  - 变量: 驼峰命名法 (`camelCase`) (例如，`username`, `statusCode`)。
  - 常量: 全大写下划线命名法 (SCREAMING_SNAKE_CASE) (例如，`DEFAULT_PAGE_SIZE`)。
- **不变性**: 在可能的情况下，优先选择领域对象和 DTOs 的不变性，使用 `records` 或不可变类来减少副作用并提高线程安全性。
- **Optional**: 使用 `Optional<T>` 显式处理可能缺失的值，避免 `NullPointerException`。
- **Streams API**: 优先使用 Java Streams API 进行集合处理，提倡函数式和声明式编程。
- **异常处理**:
  - 使用特定异常。避免捕获通用 `Exception`。
  - 对于不可恢复的错误，抛出运行时异常。
  - 对于可恢复的错误，如果业务逻辑需要，定义自定义受检异常。
  - 利用 Spring 的 `@ControllerAdvice` 和 `@ExceptionHandler` 进行集中式全局异常处理和一致的 API 错误响应。
- **代码审查**: 所有后端代码在合并前必须经过彻底的人工代码审查，特别是遵循 GitFlow 原则。IntelliJ IDEA 的集成代码分析工具应作为初次审查使用。

## 文档与注释

- 后端 Java 代码中的所有**公共**类、方法和重要字段必须包含全面的 Javadoc 注释。
- Javadoc 应解释其目的、参数 (`@param`)、返回值 (`@return`) 和抛出的异常 (`@throws`)。
- Javadoc 的格式如下：
  - Javadoc 需要遵循每行最多 100 个字符（包括用于调整格式的空白字符）。若内容超出了 100 字符，则应当在小于 100 字符的最后一个单词结尾处用换行符换行。但是如果在换行后，下一行句子的开头只有一个单词后就结束，则应当提前一个单词换行。

    ```java
    /**
     * Enables configuration properties for S3 file storage services. Individual service beans are
     * created by their respective service classes to better support conditional configuration.
     */
    ```

  - 每个段落之间使用一个 `<p>` 分割。

    ```java
    /**
     * This is the first paragraph of the Javadoc.
     * <p>
     * This is the second paragraph of the Javadoc.
     */
    ```

  - 每个段落的内容必须是语法正确且含义完整的段落，遵循英文句子规范。
  - 所有参数（`@param`）、返回值（`@return`）、异常抛出（`@throws`）及参考（`@see`）的解释需要遵循下面的规则：
    - 无需使用大写字母开头
    - 若描述的最后为陈述句，则无需使用标点符号结尾

    ```java
    /**
     * Returns the greater of two {@code int} values. That is, the
     * result is the argument closer to the value of
     * {@link Integer#MAX_VALUE}. If the arguments have the same value,
     * the result is that same value.
     *
     * @param a an argument
     * @param b another argument
     * @return the larger of {@code a} and {@code b}
     */
    public static int max(int a, int b) {
        return (a >= b) ? a : b;
    }
    ```

## 依赖管理 (Gradle)

- **构建文件**: `build.gradle.kts` 必须组织良好，对插件、依赖项和任务有清晰的划分。
- **依赖版本**: 必须在 `gradle/libs.versions.toml` 文件中集中管理依赖项版本，以确保一致性。
- **插件管理**: 显式声明 Gradle 插件及其版本。
- **避免不必要的依赖项**: 仅包含项目实际使用的依赖项。定期审查并清理未使用的依赖项。

## API 设计 (RESTful)

- **RESTful 原则**: 遵循 RESTful 原则：
  - **资源**: 将数据建模为可通过 URI 标识的资源。
  - **HTTP 方法**: 适当地使用标准 HTTP 方法（GET 用于检索，POST 用于创建，PUT 用于完全更新，PATCH 用于部分更新，DELETE 用于删除）。
  - **无状态性**: API 应是无状态的；客户端向服务器发送的每个请求都必须包含理解请求所需的所有信息。
- **URI**:
  - 集合资源使用复数名词（例如，`/users`，`/products`）。
  - URI 中使用连字符以提高可读性（例如，`/user-accounts`）。
  - 避免在 URI 中使用动词（例如，使用 `/users` 而不是 `/getAllUsers`）。
- **状态码**: 使用适当的 HTTP 状态码来指示 API 请求的结果（例如，`200 OK`、`201 Created`、`204 No Content`、`400 Bad Request`、`401 Unauthorized`、`403 Forbidden`、`404 Not Found`、`500 Internal Server Error`）。
- **响应格式**: JSON 是首选的响应格式。
- **版本控制**: 建议在需要版本控制的接口中使用 Header 参数 `X-Endpoint-Version` 控制接口版本。

## Spring Boot 最佳实践与分层架构

- **分层架构 (MVC 配合 Manager 层)**: 我们的后端应用程序遵循严格的多层架构，确保职责清晰分离，并提高可维护性和可测试性。各层及其职责如下：
  - **控制器层 (Controller Layer)**: 位于 `controller` 包中。负责暴露 RESTful API，处理 HTTP 请求，并将请求参数/主体映射到服务层调用。控制器应保持轻量，主要关注输入验证（使用 DTOs）和协调对 `Service` 层的调用。
  - **服务层 (Service Layer)**: 位于 `service` 包中。此层封装了核心业务逻辑。服务层向 `Controller` 层提供可以直接使用的 API，抽象业务流程和事务管理。服务层协调对 `Manager` 层的调用以执行业务操作。
  - **管理器层 (Manager Layer)**: 位于 `manager` 包中。此层提供原子化的业务操作，可由 `Service` 层组合使用。管理器通常处理更复杂的业务逻辑，可能涉及在更细粒度级别上与多个仓库或其他外部系统进行交互。
  - **仓库层 (Repository Layer) (MyBatis)**: 位于 `repository` 包和 `src/main/resources/repository`（用于 XML 映射文件）中。此层负责提供原子化的数据库交互操作。

  **层间通信策略**:
  - **每一层内的组件仅可调用直接位于其下方的层中的组件。**
  - **严格禁止跨层调用（例如，Controller 直接调用 Manager，Service 直接调用 Repository）。**
  - **严格禁止向上调用（例如，Service 调用 Controller）。**
  - **横向调用（例如，Service A 调用 Service B 处理不同领域）应仔细考虑，通常表明需要将共享逻辑重构到 `Manager` 或为该共享关注点重构一个专用 `Service` 中。**

  - **配置**: 优先选择 `application.yml` 进行配置属性，而不是 `application.properties`，以获得更好的可读性和分层结构。使用 `@ConfigurationProperties` 进行类型安全配置。
  - **依赖注入**: 所有依赖项都使用构造函数（强制依赖）或 Setter（非强制依赖）注入。避免在字段上使用 `@Autowired`，因为它会使测试更困难并隐藏依赖项。
  - **服务**: 业务逻辑类使用 `@Service` 进行注解。服务应保持精简，并专注于协调领域操作，这些操作通常涉及通过 `Manager` 层组件进行业务逻辑处理，以及通过 `Manager` 或直接与 MyBatis 仓库进行交互（如果该特定操作不需要中间 Manager 逻辑，尽管对于所有仓库交互，Manager 层是首选，符合分层架构定义）。

- **仓库 (MyBatis 与 JPA)**:
  - **项目使用 MyBatis 及 JPA 进行数据库操作**。`repository` 包及 `mapper` 包中的仓库接口定义了数据访问契约。
  - 相应的 SQL 定义在位于 `src/main/resources/mapper` 的 XML 映射文件中管理。
  - 数据操作约定:
    - 对于简单数据库操作，使用 JPA。
    - 对于复杂数据库操作，使用 MyBatis。
    - 当进行分页查询时，页码应从 0 开始（*兼容 Spring Data JPA*）。
  - **数据操作方法命名约定**:
    - 对于**查询数据列表**：方法**必须**以 `selectListBy` 开头，紧随其后是筛选条件（例如，`selectListByUserId`、`selectListByDepartmentIdAndStatus`）。这些方法也必须包含一个 `PageRequest` 参数用于分页。
    - 对于查询**单个数据记录**：方法**必须**以 `selectOne` 开头（例如，`selectOneById`、`selectOneByUsername`）。
    - 对于**保存新数据**：方法**必须**命名为 `save`，Mapper 方法的返回值必须是 `int`（受影响的行数）。
    - 对于**更新现有数据**：方法**必须**命名为 `update`，Mapper 方法的返回值必须是 `int`（受影响的行数）。
    - 对于**删除数据**：方法**必须**以 `deleteBy` 开头，清晰地指明删除的依据（例如，`deleteById`）。Mapper 方法的返回值必须是 `int`（受影响的行数）。

- **控制器**:
  - 使用 `@RestController` 注解 REST 控制器。
  - 使用 `@GetMapping`、`@PostMapping` 等将 HTTP 方法（GET、POST、PUT、DELETE）映射到适当的控制器方法。
  - 确保请求和响应负载定义明确（DTOs）并有文档说明。
  - 控制器应主要处理 HTTP 请求/响应映射，并将实际业务逻辑委托给服务层。

- **DTOs (数据传输对象)**: 定义单独的 DTOs 用于请求和响应主体，以将内部领域模型与 API 契约解耦。在 DTOs 上使用验证注解（例如，`@Valid`、`@NotNull`、`@Size`）。

- **日志 (Slf4j & Logback)**:
  - 应用程序中的所有日志记录都使用 `org.slf4j.Logger`。
  - 配置 `application-dev.yml` 以设置日志级别、Appender 和输出格式。
  - 日志消息应具有描述性并提供足够的上下文。避免记录敏感信息。
  - 使用参数化日志记录以提高性能并防止字符串拼接开销（例如，`log.debug("Processing user: {}", userId);`）。
  - 标准日志级别：`ERROR`、`WARN`、`INFO`、`DEBUG`、`TRACE`。

## 项目结构

后端应用程序遵循结构化的 Gradle 项目布局。核心应用程序应清晰地划分为各种子包。

```text
backend-application
├── build.gradle.kts                         // 项目的主 Gradle 构建脚本
├── config                                   // 外部配置目录
│   ├── application-dev.yml                  // 开发环境的应用程序属性
│   └── application-prod.yml.example         // 生产环境属性示例（待复制和配置）
├── database                                 // 数据库相关文件
│   └── init.d                               // 数据库初始化脚本
│       └── init-en_GB.sql                   // 使用指定语言的数据库模式和初始数据的 SQL 脚本（英式英语区域设置）
├── gradle                                   // Gradle Wrapper 和配置文件
│   ├── libs.versions.toml                   // 集中管理依赖版本（Gradle 版本目录）
│   └── wrapper                              // Gradle Wrapper 文件
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── gradle.properties                        // 项目特定的 Gradle 属性
├── gradlew                                  // Gradle Wrapper 可执行文件 (Linux/macOS)
├── gradlew.bat                              // Gradle Wrapper 可执行文件 (Windows)
├── settings.gradle.kts                      // 多项目构建的 Gradle 设置（如果适用）
└── src
    ├── main
    │   ├── java
    │   │   └── com/onixbyte/application     // 应用程序的根包
    │   │       ├── Application.java         // Spring Boot 应用程序主入口点
    │   │       ├── config                   // Spring 配置类
    │   │       ├── constant                 // 定义应用程序范围常量的类
    │   │       ├── controller               // REST API 端点
    │   │       ├── domain                   // 核心领域模型和相关类型
    │   │       │   ├── common               // 通用领域对象/工具类
    │   │       │   ├── entity               // 表示数据库表的 JPA/MyBatis 实体
    │   │       │   ├── model                // 通用的实体类模型
    │   │       │   ├── view                 // 专门用于只读操作的数据传输对象（例如，查询结果、报告结构）
    │   │       │   └── web                  // 专门用于 Web 请求/响应体的数据传输对象
    │   │       │       ├── request          // 请求 DTO
    │   │       │       └── response         // 响应 DTO
    │   │       ├── exception                // 自定义应用程序特定异常
    │   │       ├── extension                // 扩展点或自定义功能
    │   │       │   ├── jackson              // Jackson 序列化/反序列化扩展
    │   │       │   └── redis                // Redis 相关扩展
    │   │       │       └── serializer
    │   │       ├── filter                   // Servlet 过滤器或 Spring Security 过滤器
    │   │       ├── manager                  // 业务逻辑协调器，通常协调多个服务或仓库
    │   │       ├── mapper                   // 数据访问层 (MyBatis 接口)
    │   │       ├── processor                // 通用处理组件或业务工作流
    │   │       ├── properties               // 用于类型安全配置属性的类 (`@ConfigurationProperties`)
    │   │       ├── repository               // 数据访问层 (Spring Data JPA 接口)
    │   │       ├── security                 // Spring Security 特定组件
    │   │       │   ├── authentication       // 自定义认证机制
    │   │       │   └── provider             // 自定义认证提供者
    │   │       ├── service                  // 核心业务逻辑（事务层）
    │   │       ├── utils                    // 通用工具类
    │   │       └── validation               // 自定义验证逻辑
    │   │           └── group                // 针对不同上下文（例如，创建、更新）的验证分组
    │   └── resources
    │       ├── application.yml              // 默认应用程序属性
    │       └── mapper                       // MyBatis XML 映射文件
    └── test
        └── java
            └── com/onixbyte/helix
                └── HelixApplicationTests.java // Spring Boot 集成测试
```

**关键观察与具体指令：**

- **外部 `config` 目录**
  - 环境配置 (`application-dev.yml`、`application-prod.yml.example`) 在顶层 `config` 目录中管理，与 `src/main/resources` 分开。这促进了特定于环境的属性管理，允许在部署时挂载或链接不同的配置。
  - **禁止上传除 `src/main/resources/application.yml` 之外的任何配置文件到 Git 仓库。**
- **数据库初始化**: `database/init.d` 目录保留用于 SQL 脚本，特别是数据库模式初始化 (`init-en_GB.sql`)，这对于环境设置和 CI/CD 流水线至关重要。这种结构暗示了"模式优先"或"代码驱动的模式演进"方法。
- **`client` 包**: 该包用于向应用提供所有中间件的服务，如 HTTP、S3 存储、Redis 调用等。对于需要添加到 Spring 上下文中的，自行编码实现的功能（如 JSON Web Token 生成与解析）也推荐放到该包中。
- **MyBatis 与 Spring Data JPA 集成**
  - `src/main/java/.../mapper` 包包含 MyBatis mapper 接口，而实际的 SQL 定义位于 `src/main/resources/mapper/*.xml` 文件中。这种分离是保持代码整洁同时利用 MyBatis 强大 XML 映射能力的关键。
  - `src/main/java/.../repository` 包包含 Spring Data JPA 接口。
- **`domain` 包的粒度**:
  - `domain.entity`: 保留用于直接映射到数据库表的类（MyBatis 的 POJO）。
  - `domain.model`: 用于不直接与单个表一对一映射的更通用领域对象或聚合根。
  - `domain.view`: 专门用于在只读场景（例如，查询结果、报告结构）中呈现数据的数据传输对象 (DTO)。
  - `domain.web.request` / `domain.web.response`: 明确分离的用于传入 API 请求和传出 API 响应的 DTO，严格遵守 API 契约并与内部领域实体解耦。
- **`manager` 和 `processor` 包**: 这些包暗示了一个分层架构，其中"管理器"协调涉及多个服务或仓库的操作，而"处理器"可能处理业务流程的特定方面。强制明确定义这些包中类的职责，以防止出现"贫血领域模型"或"上帝对象"等反模式。
- **`security` 包**: 此子包包含除初始配置之外的自定义 Spring Security 组件，例如自定义认证类型和提供者，表明了定制的安全实现。
- **`properties` 包**: 此包用于自定义 `@ConfigurationProperties` 类，促进对 YML 文件中定义的应用程序设置进行类型安全访问，位置得当。
- **`extension` 包**: 这是一个灵活的区域，用于应用程序特定的扩展，例如自定义 Jackson 序列化器或 Redis 定制。应谨慎使用，以防止成为"杂项"的堆放地。

## 安全性 (Spring Security)

- **强制使用**: Spring Security 在所有 Spring Boot Web 应用程序中都是强制的。
- **认证与授权**: 在 `SecurityConfig.java` 中配置认证机制（例如，OAuth 2.0、JWT、基于会话）和授权规则。
- **CSRF 保护**: 确保对修改状态的操作启用 CSRF 保护，除非有充分的理由禁用它（例如，已存在其他机制的无状态 API）。
- **CORS**: 根据前端部署要求正确配置跨域资源共享 (CORS)。
- **第三方身份提供者**: 在与第三方身份提供者（例如 Microsoft Entra ID）集成时，遵循安全令牌处理和用户配置的最佳实践。敏感凭据必须安全管理（例如，环境变量、Vault）。
- **输入验证**: 始终在服务器端验证所有用户输入，以防止常见的漏洞，如 SQL 注入、XSS 等。
- **内容安全策略 (CSP)**: 考虑为前端实施强大的 CSP 以减轻 XSS 攻击。
