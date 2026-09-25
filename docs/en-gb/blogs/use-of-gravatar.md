---
title: Use Gravatar in First-party Systems
tags:
  - gravatar
  - avatar
author:
  name: Zihlu Wang
  email: real@zihluwang.me
---

[Gravatar](https://gravatar.com) (Globally Recognised Avatar) is a service that associates avatar images with email
addresses. When a user registers on your platform with their email, you can display their Gravatar as a default avatar
without building your own image upload and storage pipeline.

## How It Works

Gravatar exposes a simple HTTP endpoint. You compute the SHA256 hash of the user's **lowercased and trimmed** email
address, then embed it in an image URL:

```
https://gravatar.com/avatar/<hash>
```

## Generating the Hash

### Node.js

```js
import { createHash } from "node:crypto"

const email = "user@example.com".trim().toLowerCase()
const hash = createHash("sha256").update(email).digest("hex")
const url = `https://gravatar.com/avatar/${hash}`
```

### Python

```python
import hashlib

email = "user@example.com".strip().lower()
hash = hashlib.sha256(email.encode()).hexdigest()
url = f"https://gravatar.com/avatar/{hash}"
```

### Shell

```shell
echo -n "user@example.com" | tr '[:upper:]' '[:lower:]' | sha256sum | cut -d ' ' -f1
```

## URL Parameters

The `/avatar/` endpoint accepts several query parameters to customise the result:

| Parameter | Description                             | Example        |
| --------- | --------------------------------------- | -------------- |
| `s`       | Size in pixels (default: 80)            | `?s=200`       |
| `d`       | Default image when no Gravatar is found | `?d=identicon` |
| `r`       | Content rating (`g`, `pg`, `r`, `x`)    | `?r=g`         |

### Default Image Options (`d`)

- `identicon` — a geometric pattern based on the hash
- `robohash` — a generated robot image
- `retro` — an 8-bit style pixelated face
- `monsterid` — a generated monster cartoon
- `wavatar` — a generated face
- `mp` — a generic silhouette (Mystery Person)
- `blank` — a transparent PNG
- A custom URL (must be URL-encoded)

### Putting It Together

```html
<img
  src="https://gravatar.com/avatar/a3b4c5d6e7f8?s=160&d=robohash&r=g"
  alt="User avatar"
  width="160"
  height="160" />
```

Always pass the `d` parameter to avoid broken images for users who have not set up a Gravatar. `identicon` and
`robohash` are popular choices because they generate a unique, recognisable image for every hash.
