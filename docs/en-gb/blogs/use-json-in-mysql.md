---
title: Using JSON in MySQL
tags:
  - mysql
  - json
  - database
author:
   name: Zihlu Wang
   email: real@zihluwang.me
---

MySQL (since version 5.7) **does not directly support a data type called `jsonb`**. `jsonb` is a data type specific to PostgreSQL, which stores JSON data in a binary format with pre-parsing for faster access and manipulation during queries.

However, MySQL's `JSON` data type is functionally and internally similar to PostgreSQL's `jsonb` in many respects, particularly when it comes to querying data.

The `JSON` data type in MySQL was introduced in MySQL 5.7 and has the following characteristics:

1. **Binary Storage**: Like PostgreSQL's `jsonb`, MySQL's `JSON` type data is stored in an **internal binary format** rather than as a plain text string. This makes reading and manipulating JSON data more efficient, as the database does not need to parse text-format JSON strings on every query.
2. **Automatic Validation**: When you insert or update a `JSON` column, MySQL automatically validates that its content is a valid JSON document. If not, it throws an error.
3. **Optimised Storage**: The binary format is also space-optimised, typically more compact than storing JSON in raw text format.

MySQL provides a powerful set of functions and operators for querying and manipulating `JSON` data, very similar to what you'd expect from `jsonb`:

1. **`->` (JSON Extract Operator)**: Extracts a value from a JSON document. It returns a JSON value.

   ```sql
   SELECT my_json_column->'$.key' FROM my_table;
   -- Example: extract the name property of a user object
   -- Assuming my_json_column stores {'user': {'name': 'Alice'}}
   SELECT json_data->'$.user.name' FROM my_table;
   ```

2. **`->>` (JSON Unquote Operator)**: Extracts a value from a JSON document and **automatically unquotes it**, typically returning a scalar value (e.g., string, number). This is equivalent to `JSON_UNQUOTE(JSON_EXTRACT(...))`.

   ```sql
   SELECT my_json_column->>'$.key' FROM my_table;
   -- Example: extract the name property of a user object (returns the string 'Alice' directly)
   SELECT json_data->>'$.user.name' FROM my_table;
   ```

3. **`JSON_EXTRACT(json_doc, path, ...)`**: Explicitly extracts data from a JSON document.

   ```sql
   SELECT JSON_EXTRACT(my_json_column, '$.key') FROM my_table;
   ```

4. **`JSON_CONTAINS(json_doc, candidate, path)`**: Checks whether a JSON document contains a specified value.

   ```sql
   -- Check whether the tags array contains 'backend'
   -- Assuming my_json_column stores {'tags': ['frontend', 'backend']}
   SELECT * FROM my_table WHERE JSON_CONTAINS(json_data->'$.tags', '"backend"');
   ```

5. **`JSON_SEARCH(json_doc, one_or_all, search_str, escape_char, path, ...)`**: Returns the path to a specified string within a JSON document.

   ```sql
   -- Find the path to a value of 'test'
   SELECT JSON_SEARCH(my_json_column, 'one', 'test') FROM my_table;
   ```

6. **`JSON_TABLE(json_doc, path COLUMNS ... )` (MySQL 8.0 and later)**: A very powerful function that "expands" JSON data into relational rows and columns, ideal for complex queries and reporting.

   ```sql
   -- Assuming json_data stores {'items': [{'id': 1, 'name': 'A'}, {'id': 2, 'name': 'B'}]}
   SELECT *
   FROM my_table,
        JSON_TABLE(json_data, '$.items[*]' COLUMNS(
            itemId INT PATH '$.id',
            itemName VARCHAR(50) PATH '$.name'
        )) AS jt;
   ```

Like PostgreSQL's `jsonb`, efficient querying on JSON fields typically requires indexing. Since the content of JSON fields is dynamic, MySQL does not directly support creating traditional B-tree indexes on a specific internal path of a JSON field. However, you can achieve this through **Virtual Generated Columns**:

1. **Create a Virtual Column**: Define a virtual column whose value is extracted from a specific path in the JSON field.

   ```sql
   ALTER TABLE my_table
   ADD COLUMN user_name VARCHAR(255) AS (json_data->>'$.user.name') VIRTUAL;
   ```

2. **Create an Index on the Virtual Column**: This way, when you query `WHERE json_data->>'$.user.name' = 'Alice'`, the MySQL optimiser can use the `idx_user_name` index, significantly improving query performance.

   ```sql
   CREATE INDEX idx_user_name ON my_table (user_name);
   ```

Although MySQL does not have the exact name `jsonb`, its `JSON` data type provides highly similar functionality: binary storage optimisation, automatic validation, and rich query operators and functions. By combining virtual columns with indexes, MySQL can deliver query performance and flexibility comparable to PostgreSQL's `jsonb` when working with JSON data.
