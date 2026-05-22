---
title: MinIO Administration Guide for New Versions
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

In newer versions, MinIO has removed administrative functionality from the Web UI. You now need to use the **MinIO Client (mc)** command-line tool for all management operations.

## Installing MinIO Client (mc)

### Windows:

```powershell
# Download mc.exe
Invoke-WebRequest -Uri "https://dl.min.io/client/mc/release/windows-amd64/mc.exe" -OutFile "mc.exe"

# Or using Chocolatey
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

## Configuring the MinIO Client

```bash
# Add a MinIO server alias
mc alias set myminio http://localhost:9000 minioadmin minioadmin

# Verify the connection
mc admin info myminio
```

## User Management

### Creating Users

```bash
# Create a new user
mc admin user add myminio newuser newpassword

# List all users
mc admin user list myminio
```

### Creating Access Keys and Secret Keys

```bash
# Create a service account for a user (generates AccessKey/SecretKey)
mc admin user svcacct add myminio newuser

# Or specify custom AccessKey and SecretKey
mc admin user svcacct add myminio newuser --access-key "MYACCESSKEY123" --secret-key "MYSECRETKEY456"

# View a user's service accounts
mc admin user svcacct list myminio newuser
```

## Permission Management

### Creating Policies

```bash
# Create a policy file policy.json
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

# Add the policy
mc admin policy add myminio mypolicy policy.json

# Assign the policy to a user
mc admin policy set myminio mypolicy user=newuser
```

## Bucket Management

```bash
# Create a bucket
mc mb myminio/mybucket

# List buckets
mc ls myminio

# Set bucket policy
mc policy set public myminio/mybucket
```

## Common Administration Commands

```bash
# View server information
mc admin info myminio

# View server configuration
mc admin config get myminio

# Restart the server
mc admin service restart myminio

# View logs
mc admin logs myminio

# View statistics
mc admin prometheus metrics myminio
```

## Practical Script Example

Create an administration script `setup-minio.sh`:

```bash
#!/bin/bash

MINIO_ALIAS="myminio"
MINIO_URL="http://localhost:9000"
ADMIN_USER="minioadmin"
ADMIN_PASS="minioadmin"

# Configure the MinIO client
mc alias set $MINIO_ALIAS $MINIO_URL $ADMIN_USER $ADMIN_PASS

# Create an application user
APP_USER="appuser"
APP_PASS="apppassword"
mc admin user add $MINIO_ALIAS $APP_USER $APP_PASS

# Create a service account and retrieve AccessKey/SecretKey
echo "Creating service account for $APP_USER..."
CREDENTIALS=$(mc admin user svcacct add $MINIO_ALIAS $APP_USER --json)
ACCESS_KEY=$(echo $CREDENTIALS | jq -r '.accessKey')
SECRET_KEY=$(echo $CREDENTIALS | jq -r '.secretKey')

echo "Generated credentials:"
echo "Access Key: $ACCESS_KEY"
echo "Secret Key: $SECRET_KEY"

# Create a bucket
mc mb $MINIO_ALIAS/app-bucket

# Set a read-only policy
mc policy set download $MINIO_ALIAS/app-bucket
```

## Web Console Access

Although administrative functionality has been removed, you can still access the MinIO Console via:

```bash
# Launch the MinIO Console (if installed separately)
mc admin console myminio
```

Alternatively, specify the console address when starting the MinIO server:

```bash
minio server /data --console-address ":9001"
```

## Summary

Managing the new MinIO relies entirely on the `mc` command-line tool:

1. **Install the mc client**
2. **Configure the server alias**
3. **Use `mc admin` commands for user, permission, and bucket management**
4. **Generate AccessKeys/SecretKeys via `mc admin user svcacct`**

While this approach requires command-line operations, it provides more powerful and flexible management capabilities, particularly suited for automated deployment and script-based management.
