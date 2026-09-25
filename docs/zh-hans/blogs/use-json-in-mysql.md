---
title: 在 MySQL 中使用 JSON
tags:
  - mysql
  - json
  - database
author:
  name: Zihlu Wang
  email: real@zihluwang.me
---

MySQL (自 5.7 版本开始) **不直接支持名为 `jsonb` 的数据类型**。`jsonb` 是 PostgreSQL 数据库特有的数据类型，它以二进制格式存储 JSON 数据，并对其进行预解析，以便在查询时更快地访问和操作。

然而，MySQL 提供的 `JSON` 数据类型在功能和内部实现上与 PostgreSQL 的 `jsonb` 有很多相似之处，尤其是在查询数据方面。

MySQL 的 `JSON` 数据类型于 MySQL 5.7 版本引入，其特点如下：

1. **二进制存储**：与 PostgreSQL 的 `jsonb` 类似，MySQL 的 `JSON` 类型数据也是以**内部二进制格式**存储的，而不是简单的文本字符串。这使得 JSON 数据的读取和操作效率更高，因为数据库不必在每次查询时都解析文本格式的 JSON 字符串。
2. **自动验证**：当您插入或更新 `JSON` 列时，MySQL 会自动验证其内容是否是有效的 JSON 文档。如果不是，则会抛出错误。
3. **优化存储**：二进制格式的存储也对空间进行了优化，通常比存储原始文本格式的 JSON 更加紧凑。

MySQL 提供了一系列强大的函数和操作符来查询和操作 `JSON` 数据，这些功能与您对 `jsonb` 的期望非常相似：

1. **`->` (JSON Extract Operator)**：用于从 JSON 文档中提取值。它返回一个 JSON 值。

   ```sql
   SELECT my_json_column->'$.key' FROM my_table;
   -- 示例：提取 user 对象的 name 属性
   -- 假设 my_json_column 存储 {'user': {'name': 'Alice'}}
   SELECT json_data->'$.user.name' FROM my_table;
   ```

2. **`->>` (JSON Unquote Operator)**：用于从 JSON 文档中提取值并**自动取消引用 (unquote)**，通常返回一个标量值（如字符串、数字）。这等同于 `JSON_UNQUOTE(JSON_EXTRACT(...))`。

   ```sql
   SELECT my_json_column->>'$.key' FROM my_table;
   -- 示例：提取 user 对象的 name 属性（直接返回字符串 'Alice'）
   SELECT json_data->>'$.user.name' FROM my_table;
   ```

3. **`JSON_EXTRACT(json_doc, path, ...)`**：显式地从 JSON 文档中提取数据。

   ```sql
   SELECT JSON_EXTRACT(my_json_column, '$.key') FROM my_table;
   ```

4. **`JSON_CONTAINS(json_doc, candidate, path)`**：检查 JSON 文档中是否包含指定的值。

   ```sql
   -- 检查tags数组是否包含 'backend'
   -- 假设 my_json_column 存储 {'tags': ['frontend', 'backend']}
   SELECT * FROM my_table WHERE JSON_CONTAINS(json_data->'$.tags', '"backend"');
   ```

5. **`JSON_SEARCH(json_doc, one_or_all, search_str, escape_char, path, ...)`**：返回指定字符串在 JSON 文档中的路径。

   ```sql
   -- 查找值为 'test' 的路径
   SELECT JSON_SEARCH(my_json_column, 'one', 'test') FROM my_table;
   ```

6. **`JSON_TABLE(json_doc, path COLUMNS ...) ` (MySQL 8.0 及更高版本)**：这是一个非常强大的函数，可以将 JSON 数据 "展开" 成关系型的行和列，非常适合进行复杂查询和报表。

   ```sql
   -- 假设 json_data 存储 {'items': [{'id': 1, 'name': 'A'}, {'id': 2, 'name': 'B'}]}
   SELECT *
   FROM my_table,
        JSON_TABLE(json_data, '$.items[*]' COLUMNS(
            itemId INT PATH '$.id',
            itemName VARCHAR(50) PATH '$.name'
        )) AS jt;
   ```

像 PostgreSQL 的 `jsonb` 一样，为了对 JSON 字段进行高效查询，您通常需要创建索引。由于 JSON 字段的内容是动态的，MySQL 不直接支持在 JSON 字段的某个内部路径上直接创建传统 B-tree 索引。但是，可以通过 **虚拟列 (Virtual Generated Columns)** 来实现：

1. **创建虚拟列**：定义一个虚拟列，其值是从 JSON 字段中提取的特定路径。

   ```sql
   ALTER TABLE my_table
   ADD COLUMN user_name VARCHAR(255) AS (json_data->>'$.user.name') VIRTUAL;
   ```

2. **在虚拟列上创建索引**：这样，当您查询 `WHERE json_data->>'$.user.name' = 'Alice'` 时，MySQL 优化器可以选择使用 `idx_user_name` 索引，从而大大提高查询性能。

   ```sql
   CREATE INDEX idx_user_name ON my_table (user_name);
   ```

尽管 MySQL 没有 `jsonb` 这个名字，但其 `JSON` 数据类型提供了高度相似的功能：二进制存储优化、自动验证和丰富的查询操作符及函数。通过结合虚拟列和索引，MySQL 可以在处理 JSON 数据时提供与 PostgreSQL 的 `jsonb` 相似的查询性能和灵活性。
