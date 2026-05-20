---
title: 在第一方系统中使用 Gravatar
---

[Gravatar](https://gravatar.com)（Globally Recognised Avatar）是一项将头像图片与邮箱地址关联的服务。当用户使用邮箱在你的平台上注册时，你可以直接展示其
Gravatar 作为默认头像，而无需自行搭建图片上传和存储服务。

## 工作原理

Gravatar 提供了一个简单的 HTTP 端点。你只需计算用户**小写并去除首尾空格后**的邮箱地址的 SHA256 哈希值，然后将其嵌入图片
URL：

```
https://gravatar.com/avatar/<hash>
```

## 生成哈希

### Node.js

```js
import { createHash } from "node:crypto";

const email = "user@example.com".trim().toLowerCase();
const hash = createHash("sha256").update(email).digest("hex");
const url = `https://gravatar.com/avatar/${hash}`;
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

## URL 参数

`/avatar/` 端点接受以下查询参数来定制结果：

| 参数  | 描述                     | 示例             |
|-----|------------------------|----------------|
| `s` | 图片尺寸（像素，默认 80）         | `?s=200`       |
| `d` | 未找到 Gravatar 时的默认图片    | `?d=identicon` |
| `r` | 内容分级（`g`、`pg`、`r`、`x`） | `?r=g`         |

### 默认图片选项（`d`）

- `identicon` — 基于哈希值的几何图案
- `robohash` — 自动生成的机器人图片
- `retro` — 8-bit 风格的像素化人脸
- `monsterid` — 自动生成的怪物卡通
- `wavatar` — 自动生成的人脸
- `mp` — 通用剪影（Mystery Person）
- `blank` — 透明 PNG
- 自定义 URL（需经过 URL 编码）

### 完整示例

```html
<img
  src="https://gravatar.com/avatar/a3b4c5d6e7f8?s=160&d=robohash&r=g"
  alt="用户头像"
  width="160"
  height="160"
/>
```

始终传入 `d` 参数以避免未设置 Gravatar 的用户出现裂图。`identicon` 和 `robohash` 是常用的选择，因为它们能为每个哈希值生成唯一且易于辨识的图片。
