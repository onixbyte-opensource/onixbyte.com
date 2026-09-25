---
title: OnixByte Toolbox API
---

## Package Overview

All modules are published under the `com.onixbyte` group ID. Each module has its own base package:

| Module               | Maven Artifact         | Base Package                          |
|----------------------|------------------------|---------------------------------------|
| Common Toolbox       | `common-toolbox`       | `com.onixbyte.common`                 |
| Crypto Toolbox       | `crypto-toolbox`       | `com.onixbyte.crypto`                 |
| Math Toolbox         | `math-toolbox`         | `com.onixbyte.math`                   |
| Tuple                | `tuple`                | `com.onixbyte.tuple`                  |
| Identity Generator   | `identity-generator`   | `com.onixbyte.identitygenerator`      |

---

## Common Toolbox

### Adapter

`ObjectMapAdapter` — Converts between objects and maps. Useful for serialisation or data transformation scenarios where key-value representations are preferred.

```java
import com.onixbyte.common.adapter.ObjectMapAdapter;
```

### Utility Classes

| Class              | Description                                              |
|--------------------|----------------------------------------------------------|
| `AesUtil`          | AES symmetric encryption/decryption with key generation   |
| `Base64Util`       | Base64 encoding and decoding with multiple charset support|
| `BoolUtil`         | Boolean parsing and conversion utilities                  |
| `BranchUtil`       | Conditional branching helpers with functional-style chains|
| `CollectionUtil`   | Collection manipulation — grouping, partitioning, merging |
| `HashUtil`         | Hashing utilities supporting MD5, SHA-1, SHA-256, SHA-512 |
| `MapUtil`          | Map builder, merge, and transformation helpers            |
| `RangeUtil`        | Numeric range operations with boundary handling           |

**AesUtil Example:**

```java
var key = AesUtil.generateKey();
var encrypted = AesUtil.encrypt("hello world", key);
var decrypted = AesUtil.decrypt(encrypted, key);
```

**HashUtil Example:**

```java
var md5 = HashUtil.md5("hello world");
var sha256 = HashUtil.sha256("hello world");
var fileSha = HashUtil.sha256(new File("data.bin"));
```

**CollectionUtil Example:**

```java
var partitioned = CollectionUtil.partition(list, 100);
var grouped = CollectionUtil.groupBy(users, User::getDepartment);
```

---

## Crypto Toolbox

Provides a clean abstraction for loading cryptographic keys in PEM format. Supports both RSA and ECDSA algorithms.

### Key Loaders

| Class                     | Description                                |
|---------------------------|--------------------------------------------|
| `RSAPrivateKeyLoader`     | Load RSA private keys from PEM strings     |
| `RSAPublicKeyLoader`      | Load RSA public keys from PEM strings      |
| `ECPrivateKeyLoader`      | Load ECDSA private keys from PEM strings   |
| `ECPublicKeyLoader`       | Load ECDSA public keys from PEM strings    |

All key loaders implement either `PrivateKeyLoader` or `PublicKeyLoader` interfaces.

**RSA Example:**

```java
var privateKey = new RSAPrivateKeyLoader().load(pemString);
var publicKey = new RSAPublicKeyLoader().load(pemString);
```

**ECDSA Example:**

```java
var ecPrivateKey = new ECPrivateKeyLoader().load(pemString);
var ecPublicKey = new ECPublicKeyLoader().load(pemString);
```

### Utility

`CryptoUtil` — Provides convenient methods for digital signature creation and verification, as well as general-purpose cryptographic helpers.

### Exceptions

| Class                  | Description                                       |
|------------------------|---------------------------------------------------|
| `KeyLoadingException`  | Thrown when a PEM-formatted key fails to parse     |

---

## Math Toolbox

Statistical computation utilities for working with numeric datasets.

### Core Classes

| Class                   | Description                                              |
|-------------------------|----------------------------------------------------------|
| `Calculator`            | Statistical calculator for mean, median, variance, standard deviation, sum, min, max |
| `PercentileCalculator`  | Percentile computation with configurable interpolation strategies |

**Calculator Example:**

```java
var stats = new Calculator(Arrays.asList(1.0, 2.0, 3.0, 4.0, 5.0));
double mean = stats.getMean();
double median = stats.getMedian();
double stdDev = stats.getStandardDeviation();
```

**PercentileCalculator Example:**

```java
var calculator = new PercentileCalculator(data);
double p95 = calculator.calculate(95);
double p99 = calculator.calculate(99);
```

### Model

| Class             | Description                                                    |
|-------------------|----------------------------------------------------------------|
| `QuartileBounds`  | Holds Q1, median (Q2), Q3 values along with IQR and whisker bounds |

---

## Tuple

Lightweight generic tuple types for when you need to return multiple values without defining a dedicated class.

### Classes

| Class              | Type Parameters | Mutability |
|--------------------|-----------------|------------|
| `Tuple<A, B>`      | Two elements    | Mutable    |
| `ImmutableTuple<A, B>` | Two elements | Immutable  |
| `Triple<A, B, C>`  | Three elements  | Mutable    |
| `ImmutableTriple<A, B, C>` | Three elements | Immutable |

**Example:**

```java
var pair = Tuple.of("key", 42);
var triple = Triple.of("id", "name", 100);
var immutable = ImmutableTuple.of("constant", true);

// Accessors
String first = pair.getFirst();
Integer second = pair.getSecond();

// Triple accessors
String a = triple.getFirst();
String b = triple.getSecond();
Integer c = triple.getThird();
```

---

## Identity Generator

Generates unique identifiers suitable for use as database primary keys or distributed IDs.

### Interface

`IdentityGenerator<T>` — Generates identities of type `T`.

### Implementations

| Class                        | Description                                                     |
|------------------------------|-----------------------------------------------------------------|
| `SequentialUuidGenerator`    | Generates time-ordered, sequential UUIDs (optimised for DB indexes) |
| `SnowflakeIdentityGenerator` | Snowflake-style distributed unique ID generation                 |

**Sequential UUID:**

```java
var generator = new SequentialUuidGenerator();
UUID id = generator.nextId(); // time-ordered UUID, B-tree friendly
```

**Snowflake:**

```java
var generator = new SnowflakeIdentityGenerator(workerId, datacenterId);
long id = generator.nextId(); // 64-bit snowflake ID
```

### Exceptions

| Class             | Description                                                    |
|-------------------|----------------------------------------------------------------|
| `TimingException` | Thrown when the system clock moves backwards, compromising ID uniqueness |
