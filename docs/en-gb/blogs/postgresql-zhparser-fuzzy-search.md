---
title: Accelerating Fuzzy Search in PostgreSQL with Tokenisation
tags:
  - postgresql
  - zhparser
  - full-text-search
  - performance
author:
  name: Siu Jam Oh
  email: jamo.siu@gmail.com
---

## Background and Challenges

As our business data surpassed **2 million rows**, traditional `LIKE '%keyword%'` fuzzy queries triggered frequent database I/O alerts, with query response times degrading from milliseconds to seconds. To improve search efficiency and support Chinese semantics, we decided to introduce the `zhparser` extension for full-text search.

## Evolution Path and Environment Adaptation

This implementation went through four key phases, each addressing distinct technical challenges:

### CentOS 7.9 VM (Feasibility Validation)

- **Goal**: Validate the compatibility of `SCWS` + `zhparser` on older systems.
- **Core Action**: Manually compiled `postgresql-16.2` from source in a CentOS 7.9 environment, got the extension working end-to-end.

**Conclusion**: Confirmed significant performance improvements from the tokenisation approach for Chinese search.

### Local Docker Container (Containerisation Exploration)

- **Goal**: Initial testing in a complete local system.
- **Core Action**: Injected binary `.so` files via `docker cp`, resolved `ldconfig` dynamic library path visibility issues.
- **Discovery**: Identified that **missing dictionary files** cause tokenisation to degrade into single-character (particle-level) tokenisation — a critical failure point.

### EulerOS 2.0 Test Server (Self-Compiled Environment Adaptation)

- **Goal**: Adapt to the production OS architecture (x86_64) and self-compiled PostgreSQL installation.
- **Core Issue**: Resolved `libscws.so.1` loading errors.
- **Key Solutions**:
  - Ensured the `postgres` runtime user has access permissions to `/usr/local/scws/lib`.
  - Modified `systemd` service environment variables or created `/usr/lib64` symlinks to force refresh library search paths.

### Production Deployment Preparation (Final Tuning)

- **Goal**: Ensure query stability at 2M+ data volume.
- **Optimisation**: Addressed cases where non-semantic fragments (e.g., "古唐合") returned no results by establishing a "full-text search first + `pg_trgm` index assist" degraded query strategy.

## Core Installation and Configuration Steps (Self-Compiled Environments)

### Installing the `SCWS` Tokenisation Engine

SCWS is the underlying core dependency of `zhparser` and must be installed first.

1. **Download and Extract**: Download the source package (e.g., `scws-1.2.3`).
2. **Compile and Install**:

   ```bash
   ./configure --prefix=/usr/local/scws
   make && make install
   ```

3. **Verify the Library**: Ensure `/usr/local/scws/lib/libscws.so.1` exists.

### Compiling and Installing `zhparser`

This step requires `pg_config` from the self-compiled PostgreSQL installation.

1. **Get the Source**: Clone the `zhparser` project from GitHub.
2. **Compile with Specified Path**:

   ```bash
   # Ensure pg_config is in PATH, or specify manually
   make USE_PGXS=1 PG_CONFIG=/usr/local/pgsql/bin/pg_config
   make USE_PGXS=1 PG_CONFIG=/usr/local/pgsql/bin/pg_config install
   ```

   _Note: The `install` step automatically places `zhparser.so` into PG's `pkglibdir` and extension scripts into the `extension` directory._

### Resolving Dynamic Library Dependencies

1. **Refresh System Cache**:

   ```bash
   echo "/usr/local/scws/lib" > /etc/ld.so.conf.d/scws.conf
   ldconfig
   ```

2. **Permission Check**: Ensure the OS user running `postgres` has `rx` permission on `/usr/local/scws/lib`.
3. **Force Symlink (Alternative)**: If `ldconfig` fails, symlink the library file to `/usr/lib64`.

### Restarting the Database

After modifying system shared library configuration, the PostgreSQL process must be restarted to reload environment variables and linked libraries.

```bash
## Restart using pg_ctl (paths may vary for self-compiled installations)
/usr/local/pgsql/bin/pg_ctl -D /usr/local/pgsql/data restart

## Or restart via systemd (if registered as a service)
systemctl restart postgresql
```

### Database-Level Initialisation

Connect to `psql` and run the logical configuration:

```sql
-- Create the extension
CREATE EXTENSION zhparser;

-- Create a full-text search configuration and bind the tokeniser
CREATE TEXT SEARCH CONFIGURATION chinese (PARSER = zhparser);

-- Add token mappings
ALTER TEXT SEARCH CONFIGURATION chinese ADD MAPPING FOR n,v,a,i,e,l,t,b WITH simple;

-- [Optional] Specify the dictionary path for self-compiled installations
-- ALTER DATABASE postgres SET zhparser.dict_path = '/usr/local/scws/etc/dict.utf8.xdb';
```

## Performance Analysis and Pitfalls

### Index Performance Bottleneck Analysis

During testing, it was found that even exact queries suffered from `Bitmap Index Scan` due to an improperly designed composite index (with `create_time` as the leading column), resulting in query times as high as **482 ms**.

- **Improvement**: Created single-column **B-tree** indexes on frequently searched columns, reducing response time to under **10 ms** with `Index Scan`.

### GIN Index and Non-Semantic Matching

- **Cross-Word Truncation**: The tokenisation engine is semantic-based, so truncated strings like "古唐合" may fail to match with `@@` due to tokenisation boundaries.
- **Mitigation Strategy**: Adopt a "waterfall search" approach. Full-text search (FTS) first; if the result set is empty, automatically degrade to `LIKE` fuzzy queries, assisted by `pg_trgm` indexing.

## Final Deployment Strategy: Dual-Track Parallel Retrieval

After analysing the data, we found that approximately 1.24% of account names contain non-standard Simplified Chinese characters, and some company names in the database are unusual enough to cause search failures. We adopted a "stepwise degradation" strategy:

- **Step 1: Full-Text Search (Fast Track)**: Use GIN index for `@@` matching.
- **Step 2: Result Evaluation**: If the result set is empty, check whether the search term contains letters or suspected Traditional Chinese characters.
- **Step 3: Fuzzy Fallback (Safe Fallback)**: Execute `LIKE '%keyword%'`. Although slower, since this serves as a "gap-fill" logic triggered only ~1% of the time, it won't impose overall system pressure.

## Search Optimisation: Integrating a Custom Business Lexicon

To address issues like company brand names being incorrectly segmented by full-text search (e.g., "元一" being split into a numeral and a quantifier), we built an automated maintenance pipeline from data extraction to index rebuild.

### Lexicon Extraction and Preprocessing

Leverage the structural parsing capabilities of **`companynameparser`** to strip region names and industry suffixes, and use **`jieba`** for semantic validation to ensure core brand name integrity:

- **Extraction Logic**: Traverse all `buyer_unique_name` values via a Python script, extracting the core `brand` field.
- **Weight Compensation**: For words prone to fragmentation (e.g., those containing "元", "一", "三"), manually boost TF (term frequency weight) to **50.0–60.0** to ensure their priority overrides built-in quantifier rules.
- **Output Specification**: Produce SCWS-compliant 4-field `UTF-8` text (WORD, TF, IDF, ATTR). Use tab `\t` separators to avoid parsing anomalies.

### Lexicon Compilation and Deployment

<!-- TODO(link): this tip used to offer OnixByte's pre-compiled Windows build of
scws. Both URLs were dead — the GitHub one referenced an account that does not
exist, and the Gitea one is being retired. Pointing at upstream in the meantime;
restore a download link here if one is published again. -->

:::tip
The native scws command-line tool for Windows is compiled with MingW. Source and
build instructions are available from the upstream
[SCWS project](https://github.com/hightman/scws).
:::

Convert the text dictionary to SCWS's efficient binary format (XDB):

1. **Compile the Binary Dictionary**:

   ```bash
   # Use scws-gen-dict to generate an encrypted binary lexicon
   /usr/local/scws/bin/scws-gen-dict -i custom_company.txt -o /usr/local/scws/etc/custom_company.xdb -c utf8
   ```

2. **File Distribution and Permissions**: Move the generated `.xdb` file to the tokenisation data directory and ensure the `postgres` user has read permission:

   ```bash
   cp custom_company.xdb /usr/local/pgsql/share/tsearch_data/
   chown postgres:postgres /usr/local/pgsql/share/tsearch_data/custom_company.xdb
   ```

### Database Parameter Configuration

Modify `postgresql.conf` to force-load `zhparser` and its custom extension lexicon:

```plain text
## Preload the extension library (requires restart to take effect)
shared_preload_libraries = 'zhparser'

## Load custom external dictionaries (use paths relative to tsearch_data)
zhparser.extra_dicts = 'custom_company.xdb'
```

### Hot Index Rebuild and Verification

Since tokenisation rules have changed, existing data must be semantically synchronised via index rebuild:

**Physically Restart the Service**:

```bash
su - postgres -c "/usr/local/pgsql/bin/pg_ctl -D /usr/local/pgsql/data restart"
```

**Online Index Rebuild**: Use the `CONCURRENTLY` keyword to refresh the GIN index without blocking DML operations on 400K rows:

```bash
REINDEX INDEX CONCURRENTLY index_name;
```

**Tokenisation Effectiveness Verification**:

```sql
-- Expected part-of-speech should show as n (noun), not x (unknown)
SELECT * FROM ts_debug('chinese', '元一能源');
```

**Optimisation Notes:**

- **Explicit Weight Compensation**: This is the key technique that resolved the "元一" tokenisation failure (shown as `x`).
- **Distinguish Restart from Reload**: `shared_preload_libraries` must be activated via `restart`, not a simple reload.
