---
title: Java Development Standards
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

## Java Language and Coding Style

- **Java Version**: Projects should use the latest LTS version of the JDK whenever possible.
- **Naming Conventions**:
  - Classes: `PascalCase` (e.g., `UserService`, `OrderController`).
  - Methods: `camelCase` (e.g., `getUserById`, `saveOrder`).
  - Variables: `camelCase` (e.g., `username`, `statusCode`).
  - Constants: `SCREAMING_SNAKE_CASE` (e.g., `DEFAULT_PAGE_SIZE`).
- **Immutability**: Prefer immutability for domain objects and DTOs where possible, using `records` or immutable classes to reduce side effects and improve thread safety.
- **Optional**: Use `Optional<T>` to explicitly handle potentially absent values and avoid `NullPointerException`.
- **Streams API**: Prefer the Java Streams API for collection processing, promoting functional and declarative programming.
- **Exception Handling**:
  - Use specific exceptions. Avoid catching generic `Exception`.
  - Throw runtime exceptions for unrecoverable errors.
  - Define custom checked exceptions for recoverable errors if required by business logic.
  - Leverage Spring's `@ControllerAdvice` and `@ExceptionHandler` for centralised global exception handling and consistent API error responses.
- **Code Review**: All backend code must undergo thorough manual code review before merging, particularly following GitFlow principles. IntelliJ IDEA's integrated code analysis tools should be used as a first-pass review.

## Documentation and Comments

- All **public** classes, methods, and significant fields in backend Java code must include comprehensive Javadoc comments.
- Javadoc should explain the purpose, parameters (`@param`), return values (`@return`), and thrown exceptions (`@throws`).
- Javadoc formatting:
  - Javadoc must follow a maximum of 100 characters per line (including whitespace for formatting). If the content exceeds 100 characters, break at the last word that ends within the 100-character limit. However, if after the line break only a single word remains at the start of the next line, break one word earlier.

    ```java
    /**
     * Enables configuration properties for S3 file storage services. Individual service beans are
     * created by their respective service classes to better support conditional configuration.
     */
    ```

  - Use `<p>` to separate paragraphs.

    ```java
    /**
     * This is the first paragraph of the Javadoc.
     * <p>
     * This is the second paragraph of the Javadoc.
     */
    ```

  - Each paragraph must be a grammatically correct and semantically complete paragraph following English sentence conventions.
  - All `@param`, `@return`, `@throws`, and `@see` explanations must follow these rules:
    - Do not start with a capital letter.
    - If the description ends with a declarative sentence, do not use punctuation at the end.

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

## Dependency Management (Gradle)

- **Build File**: `build.gradle.kts` must be well-organised with clear separation of plugins, dependencies, and tasks.
- **Dependency Versions**: Dependency versions must be centrally managed in the `gradle/libs.versions.toml` file to ensure consistency.
- **Plugin Management**: Explicitly declare Gradle plugins and their versions.
- **Avoid Unnecessary Dependencies**: Only include dependencies actually used by the project. Regularly review and clean up unused dependencies.

## API Design (RESTful)

- **RESTful Principles**: Follow RESTful principles:
  - **Resources**: Model data as resources identifiable by URI.
  - **HTTP Methods**: Use standard HTTP methods appropriately (GET for retrieval, POST for creation, PUT for full update, PATCH for partial update, DELETE for removal).
  - **Statelessness**: APIs should be stateless; each request from client to server must contain all the information needed to understand the request.
- **URIs**:
  - Use plural nouns for collection resources (e.g., `/users`, `/products`).
  - Use hyphens in URIs for readability (e.g., `/user-accounts`).
  - Avoid verbs in URIs (e.g., use `/users` instead of `/getAllUsers`).
- **Status Codes**: Use appropriate HTTP status codes to indicate the result of API requests (e.g., `200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`).
- **Response Format**: JSON is the preferred response format.
- **Versioning**: Where version control is required, use the `X-Endpoint-Version` header parameter to control API versions.

## Spring Boot Best Practices & Layered Architecture

- **Layered Architecture (MVC with Manager Layer)**: Our backend applications follow a strict multi-layered architecture, ensuring clear separation of responsibilities and improving maintainability and testability. The layers and their responsibilities are:
  - **Controller Layer**: Located in the `controller` package. Responsible for exposing RESTful APIs, handling HTTP requests, and mapping request parameters/bodies to service layer calls. Controllers should remain lightweight, focusing primarily on input validation (using DTOs) and coordinating calls to the `Service` layer.
  - **Service Layer**: Located in the `service` package. This layer encapsulates core business logic. Services expose a directly consumable API to the `Controller` layer, abstracting business processes and transaction management. Services coordinate calls to the `Manager` layer to execute business operations.
  - **Manager Layer**: Located in the `manager` package. This layer provides atomic business operations that can be composed by the `Service` layer. Managers typically handle more complex business logic and may involve interacting with multiple repositories or other external systems at a finer granularity.
  - **Repository Layer (MyBatis)**: Located in the `repository` package and `src/main/resources/repository` (for XML mapping files). This layer is responsible for providing atomic database interaction operations.

  **Inter-Layer Communication Strategy**:
  - **Components within a layer may only call components in the layer directly below it.**
  - **Cross-layer calls are strictly prohibited** (e.g., Controller directly calling Manager, Service directly calling Repository).
  - **Upward calls are strictly prohibited** (e.g., Service calling Controller).
  - **Lateral calls** (e.g., Service A calling Service B for a different domain) should be carefully considered and typically indicate a need to refactor shared logic into a `Manager` or a dedicated `Service` for that shared concern.

  - **Configuration**: Prefer `application.yml` over `application.properties` for configuration properties, offering better readability and hierarchical structure. Use `@ConfigurationProperties` for type-safe configuration.
  - **Dependency Injection**: All dependencies should use constructor injection (mandatory dependencies) or setter injection (optional dependencies). Avoid `@Autowired` on fields, as it makes testing more difficult and hides dependencies.
  - **Services**: Business logic classes are annotated with `@Service`. Services should be kept lean and focused on orchestrating domain operations, typically involving business logic processing through `Manager` layer components and interaction through `Manager` or directly with MyBatis repositories (if the particular operation does not require intermediate Manager logic, though the Manager layer is preferred for all repository interactions consistent with the layered architecture definition).

- **Repositories (MyBatis & JPA)**:
  - **The project uses both MyBatis and JPA for database operations**. Repository interfaces in the `repository` and `mapper` packages define the data access contract.
  - Corresponding SQL definitions are managed in XML mapping files located in `src/main/resources/mapper`.
  - Data operation conventions:
    - Use JPA for simple database operations.
    - Use MyBatis for complex database operations.
    - When performing paginated queries, page numbers should start from 0 (_compatible with Spring Data JPA_).
  - **Data Access Method Naming Conventions**:
    - For **querying data lists**: methods **must** start with `selectListBy`, followed by the filter criteria (e.g., `selectListByUserId`, `selectListByDepartmentIdAndStatus`). These methods must also include a `PageRequest` parameter for pagination.
    - For querying **single data records**: methods **must** start with `selectOne` (e.g., `selectOneById`, `selectOneByUsername`).
    - For **saving new data**: methods **must** be named `save`, and Mapper method return type must be `int` (affected row count).
    - For **updating existing data**: methods **must** be named `update`, and Mapper method return type must be `int` (affected row count).
    - For **deleting data**: methods **must** start with `deleteBy`, clearly indicating the deletion criteria (e.g., `deleteById`). Mapper method return type must be `int` (affected row count).

- **Controllers**:
  - Annotate REST controllers with `@RestController`.
  - Use `@GetMapping`, `@PostMapping`, etc. to map HTTP methods (GET, POST, PUT, DELETE) to appropriate controller methods.
  - Ensure request and response payloads are clearly defined (DTOs) and documented.
  - Controllers should primarily handle HTTP request/response mapping and delegate actual business logic to the service layer.

- **DTOs (Data Transfer Objects)**: Define separate DTOs for request and response bodies to decouple the internal domain model from the API contract. Use validation annotations on DTOs (e.g., `@Valid`, `@NotNull`, `@Size`).

- **Logging (SLF4J & Logback)**:
  - All logging in the application uses `org.slf4j.Logger`.
  - Configure `application-dev.yml` to set logging levels, appenders, and output formats.
  - Log messages should be descriptive and provide sufficient context. Avoid logging sensitive information.
  - Use parameterised logging for performance and to prevent string concatenation overhead (e.g., `log.debug("Processing user: {}", userId);`).
  - Standard log levels: `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE`.

## Project Structure

Backend applications follow a structured Gradle project layout. The core application should be clearly divided into various sub-packages.

```text
backend-application
├── build.gradle.kts                         // Project's main Gradle build script
├── config                                   // External configuration directory
│   ├── application-dev.yml                  // Application properties for the development environment
│   └── application-prod.yml.example         // Example production properties (to be copied and configured)
├── database                                 // Database-related files
│   └── init.d                               // Database initialisation scripts
│       └── init-en_GB.sql                   // SQL script for database schema and initial data using the specified locale (British English)
├── gradle                                   // Gradle Wrapper and configuration files
│   ├── libs.versions.toml                   // Centralised dependency version management (Gradle Version Catalog)
│   └── wrapper                              // Gradle Wrapper files
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── gradle.properties                        // Project-specific Gradle properties
├── gradlew                                  // Gradle Wrapper executable (Linux/macOS)
├── gradlew.bat                              // Gradle Wrapper executable (Windows)
├── settings.gradle.kts                      // Gradle settings for multi-project builds (if applicable)
└── src
    ├── main
    │   ├── java
    │   │   └── com/onixbyte/application     // Application root package
    │   │       ├── Application.java         // Spring Boot application main entry point
    │   │       ├── config                   // Spring configuration classes
    │   │       ├── constant                 // Classes defining application-wide constants
    │   │       ├── controller               // REST API endpoints
    │   │       ├── domain                   // Core domain models and related types
    │   │       │   ├── common               // Common domain objects/utilities
    │   │       │   ├── entity               // JPA/MyBatis entities representing database tables
    │   │       │   ├── model                // General-purpose entity class models
    │   │       │   ├── view                 // Data transfer objects specifically for read-only operations (e.g., query results, report structures)
    │   │       │   └── web                  // Data transfer objects specifically for web request/response bodies
    │   │       │       ├── request          // Request DTOs
    │   │       │       └── response         // Response DTOs
    │   │       ├── exception                // Custom application-specific exceptions
    │   │       ├── extension                // Extension points or custom functionality
    │   │       │   ├── jackson              // Jackson serialisation/deserialisation extensions
    │   │       │   └── redis                // Redis-related extensions
    │   │       │       └── serializer
    │   │       ├── filter                   // Servlet filters or Spring Security filters
    │   │       ├── manager                  // Business logic coordinators, typically orchestrating multiple services or repositories
    │   │       ├── mapper                   // Data access layer (MyBatis interfaces)
    │   │       ├── processor                // General-purpose processing components or business workflows
    │   │       ├── properties               // Classes for type-safe configuration properties (`@ConfigurationProperties`)
    │   │       ├── repository               // Data access layer (Spring Data JPA interfaces)
    │   │       ├── security                 // Spring Security-specific components
    │   │       │   ├── authentication       // Custom authentication mechanisms
    │   │       │   └── provider             // Custom authentication providers
    │   │       ├── service                  // Core business logic (transactional layer)
    │   │       ├── utils                    // General-purpose utility classes
    │   │       └── validation               // Custom validation logic
    │   │           └── group                // Validation groups for different contexts (e.g., create, update)
    │   └── resources
    │       ├── application.yml              // Default application properties
    │       └── mapper                       // MyBatis XML mapping files
    └── test
        └── java
            └── com/onixbyte/helix
                └── HelixApplicationTests.java // Spring Boot integration tests
```

**Key Observations and Specific Instructions:**

- **External `config` Directory**
  - Environment configurations (`application-dev.yml`, `application-prod.yml.example`) are managed in the top-level `config` directory, separate from `src/main/resources`. This facilitates environment-specific property management, allowing different configurations to be mounted or linked at deployment time.
  - **Do not upload any configuration files other than `src/main/resources/application.yml` to the Git repository.**
- **Database Initialisation**: The `database/init.d` directory is reserved for SQL scripts, specifically database schema initialisation (`init-en_GB.sql`), which is critical for environment setup and CI/CD pipelines. This structure suggests a "schema-first" or "code-driven schema evolution" approach.
- **`client` Package**: This package is used to provide services for all middleware to the application, such as HTTP, S3 storage, Redis calls, etc. For self-coded functional implementations that need to be added to the Spring context (such as JSON Web Token generation and parsing), placing them in this package is also recommended.
- **MyBatis & Spring Data JPA Integration**
  - The `src/main/java/.../mapper` package contains MyBatis mapper interfaces, while the actual SQL definitions reside in `src/main/resources/mapper/*.xml` files. This separation is key to keeping code clean while leveraging MyBatis's powerful XML mapping capabilities.
  - The `src/main/java/.../repository` package contains Spring Data JPA interfaces.
- **`domain` Package Granularity**:
  - `domain.entity`: Reserved for classes directly mapped to database tables (POJOs for MyBatis).
  - `domain.model`: For more general-purpose domain objects or aggregate roots that do not map one-to-one with individual tables.
  - `domain.view`: Specifically for Data Transfer Objects (DTOs) used in read-only scenarios (e.g., query results, report structures).
  - `domain.web.request` / `domain.web.response`: Clearly separated DTOs for incoming API requests and outgoing API responses, strictly adhering to the API contract and decoupled from internal domain entities.
- **`manager` and `processor` Packages**: These packages imply a layered architecture where "managers" coordinate operations involving multiple services or repositories, while "processors" may handle specific aspects of business processes. It is mandatory to clearly define the responsibilities of classes in these packages to prevent anti-patterns such as "anaemic domain model" or "god objects".
- **`security` Package**: This sub-package contains custom Spring Security components beyond the initial configuration, such as custom authentication types and providers, indicating a tailored security implementation.
- **`properties` Package**: This package is for custom `@ConfigurationProperties` classes, facilitating type-safe access to application settings defined in YML files — well-positioned.
- **`extension` Package**: This is a flexible area for application-specific extensions, such as custom Jackson serialisers or Redis customisations. It should be used sparingly to avoid becoming a "miscellaneous" dumping ground.

## Security (Spring Security)

- **Mandatory Use**: Spring Security is mandatory in all Spring Boot web applications.
- **Authentication & Authorisation**: Configure authentication mechanisms (e.g., OAuth 2.0, JWT, session-based) and authorisation rules in `SecurityConfig.java`.
- **CSRF Protection**: Ensure CSRF protection is enabled for state-modifying operations, unless there is a strong reason to disable it (e.g., stateless APIs with other mechanisms already in place).
- **CORS**: Correctly configure Cross-Origin Resource Sharing (CORS) according to frontend deployment requirements.
- **Third-Party Identity Providers**: When integrating with third-party identity providers (e.g., Microsoft Entra ID), follow best practices for secure token handling and user provisioning. Sensitive credentials must be securely managed (e.g., environment variables, Vault).
- **Input Validation**: Always validate all user input on the server side to prevent common vulnerabilities such as SQL injection, XSS, etc.
- **Content Security Policy (CSP)**: Consider implementing a robust CSP for the frontend to mitigate XSS attacks.
