---
title: MinIO 新版本管理中心
tags:
  - minio
  - storage
  - s3
  - devops
  - cheatsheet
author:
  name: Zihlu Wang
  email: real@zihluwang.me
---

MinIO 在新版本中将管理功能从 Web UI 中移除了。现在需要使用 **MinIO Client (mc)** 命令行工具来进行管理操作。

## 安装 MinIO Client (mc)

### Windows:

```powershell
# 下载 mc.exe
Invoke-WebRequest -Uri "https://dl.min.io/client/mc/release/windows-amd64/mc.exe" -OutFile "mc.exe"

# 或使用 Chocolatey
choco install minio-client
```

### Linux/macOS:

```bash
# Linux
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
sudo mv mc /usr/local/bin/

# macOS
brew install minio/stable/mc
```

## 配置 MinIO Client

```bash
# 添加 MinIO 服务器别名
mc alias set myminio http://localhost:9000 minioadmin minioadmin

# 验证连接
mc admin info myminio
```

## 用户管理操作

### 创建用户

```bash
# 创建新用户
mc admin user add myminio newuser newpassword

# 查看所有用户
mc admin user list myminio
```

### 创建 Access Key 和 Secret Key

```bash
# 为用户创建服务账户（生成 AccessKey/SecretKey）
mc admin user svcacct add myminio newuser

# 或者指定自定义的 AccessKey
mc admin user svcacct add myminio newuser --access-key "MYACCESSKEY123" --secret-key "MYSECRETKEY456"

# 查看用户的服务账户
mc admin user svcacct list myminio newuser
```

## 权限管理

### 创建策略

```bash
# 创建策略文件 policy.json
cat > policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::mybucket/*"
      ]
    }
  ]
}
EOF

# 添加策略
mc admin policy add myminio mypolicy policy.json

# 将策略分配给用户
mc admin policy set myminio mypolicy user=newuser
```

## 存储桶管理

```bash
# 创建存储桶
mc mb myminio/mybucket

# 列出存储桶
mc ls myminio

# 设置存储桶策略
mc policy set public myminio/mybucket
```

## 常用管理命令

```bash
# 查看服务器信息
mc admin info myminio

# 查看服务器配置
mc admin config get myminio

# 重启服务器
mc admin service restart myminio

# 查看日志
mc admin logs myminio

# 查看统计信息
mc admin prometheus metrics myminio
```

## 实用脚本示例

创建一个管理脚本 `setup-minio.sh`:

```bash
#!/bin/bash

MINIO_ALIAS="myminio"
MINIO_URL="http://localhost:9000"
ADMIN_USER="minioadmin"
ADMIN_PASS="minioadmin"

# 配置 MinIO 客户端
mc alias set $MINIO_ALIAS $MINIO_URL $ADMIN_USER $ADMIN_PASS

# 创建应用用户
APP_USER="appuser"
APP_PASS="apppassword"
mc admin user add $MINIO_ALIAS $APP_USER $APP_PASS

# 创建服务账户并获取 AccessKey/SecretKey
echo "Creating service account for $APP_USER..."
CREDENTIALS=$(mc admin user svcacct add $MINIO_ALIAS $APP_USER --json)
ACCESS_KEY=$(echo $CREDENTIALS | jq -r '.accessKey')
SECRET_KEY=$(echo $CREDENTIALS | jq -r '.secretKey')

echo "Generated credentials:"
echo "Access Key: $ACCESS_KEY"
echo "Secret Key: $SECRET_KEY"

# 创建存储桶
mc mb $MINIO_ALIAS/app-bucket

# 设置只读策略
mc policy set download $MINIO_ALIAS/app-bucket
```

## Web Console 访问

虽然管理功能被移除，但您仍然可以通过以下方式访问 MinIO Console：

```bash
# 启动 MinIO Console（如果单独安装）
mc admin console myminio
```

或者在启动 MinIO 服务器时指定 Console 地址：

```bash
minio server /data --console-address ":9001"
```

## 总结

新版 MinIO 的管理完全依赖 `mc` 命令行工具：

1. **安装 mc 客户端**
2. **配置服务器别名**
3. **使用 `mc admin` 命令进行用户、权限、存储桶管理**
4. **通过 `mc admin user svcacct` 生成 AccessKey/SecretKey**

这种方式虽然需要命令行操作，但提供了更强大和灵活的管理能力，特别适合自动化部署和脚本化管理。
