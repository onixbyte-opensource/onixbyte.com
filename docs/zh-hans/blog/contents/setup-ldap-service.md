---
title: 搭建 LDAP 服务
tags:
  - ldap
  - openldap
  - authentication
  - linux
  - devops
author:
  name: Zihlu Wang
  email: real@zihluwang.me
---

搭建 LDAP（轻型目录访问协议）服务器是实现企业级**集中身份认证**和**权限管理**的核心步骤。最常用的开源实现是 **OpenLDAP**。

以下是在基于 Debian/Ubuntu 的 Linux 系统上搭建 OpenLDAP 服务器的详细步骤。

## 环境准备与安装

在开始之前，请确保你的系统软件包是最新的，并设置好主机名。

```bash
## 更新系统
sudo apt update && sudo apt upgrade -y

## 安装 OpenLDAP 及管理工具
## slapd 是守护进程，ldap-utils 是命令行客户端工具
sudo apt install slapd ldap-utils -y
```

> 在安装过程中，系统会提示你设置 **LDAP 管理员密码**。请务必记住这个密码，稍后配置时会频繁使用。

## 配置 OpenLDAP 服务器

虽然安装时已经初始化了部分设置，但通常我们需要根据具体的域名（如 `example.com`）进行自定义配置。

### 重新配置 slapd

执行以下命令进入交互式配置界面：

```bash
sudo dpkg-reconfigure slapd
```

**配置建议**:

1. **Omit OpenLDAP server configuration?** 选择 **No**。
2. **DNS domain name:** 输入你的域名（例如 `centre.example.com`）。这将决定你的基准识别名（Base DN），如 `dc=centre,dc=example,dc=com`。
3. **Organization name:** 输入你的组织名称。
4. **Administrator password:** 输入之前设置的管理员密码。
5. **Database backend:** 建议选择 **MDB**。
6. **Remove database when slapd is purged?** 选择 **No**。
7. **Move old database?** 选择 **Yes**。

## 理解 LDAP 层级结构

LDAP 的数据是以**树状结构**存储的。为了方便管理，我们通常会创建两个"组织单元"（Organizational Units, OU）：一个存放用户（Users），一个存放组（Groups）。

## 创建组织单元 (OU)

在 LDAP 中，我们使用 **LDIF** (LDAP Data Interchange Format) 文件来添加或修改目录。

创建一个名为 `base.ldif` 的文件：

```text
## 创建用户组 OU
dn: ou=people,dc=centre,dc=example,dc=com
objectClass: organizationalUnit
ou: people

## 创建用户组别 OU
dn: ou=groups,dc=centre,dc=example,dc=com
objectClass: organizationalUnit
ou: groups
```

**导入数据：**

```bash
## 使用管理员身份将 LDIF 文件导入数据库
ldapadd -x -D "cn=admin,dc=centre,dc=example,dc=com" -W -f base.ldif
```

## 添加用户和组

创建一个名为 `groups.ldif` 的文件来定义一个新组：

```text
## 定义一个新组
dn: cn=developers,ou=groups,dc=centre,dc=example,dc=com
objectClass: inetOrgGroup
cn: developers
```

创建一个名为 `users.ldif` 的文件来定义一个新用户：

```text
## 定义一个新用户
dn: uid=jbloggs,ou=people,dc=centre,dc=example,dc=com # 该条目的身份证号，即 Distinguished Name (DN)。
objectClass: inetOrgPerson # 对象类，inetOrgPerson 代表这是一个互联网机构人员。它允许你使用 email、displayName、telephoneNumber 等常见的联系人属性
objectClass: posixAccount # 它使该条目兼容 Unix/Linux 系统账号。有了它，用户才能登录 Linux 服务器，并拥有 UID、GID 和家目录。
objectClass: shadowAccount # 用于管理密码老化（如过期、更改警告等），对应 Linux 中的 /etc/shadow 文件功能。
uid: jbloggs # 用户的登录名（User ID）。在 Linux 登录界面输入的通常就是这个。
sn: Bloggs # 姓（Surname）。inetOrgPerson 类要求必须填写。
givenName: Joe # 名（First Name）。
cn: Joe Bloggs # 全名（Common Name）。这是 LDAP 条目的标准显示名称。
displayName: Joe Bloggs # 在图形界面或邮件客户端显示的友好名称。
uidNumber: 10000 # Linux 系统中的用户 ID 数字
gidNumber: 5000 # 用户主组的 ID 数字。
userPassword: {SSHA}密码哈希值或明文 # 存储用户的加密密码。
homeDirectory: /home/jbloggs # 用户登录 Linux 后的家目录路径。
loginShell: /bin/bash # 用户登录后使用的 Shell 环境。
```

> 如果您将来要集成 **GitLab**、**Jenkins** 或 **VPN**，它们通常会搜索 `uid` 属性来验证登录名。

### FAQ

#### 如果不需要为该用户授予服务器的登录权限，是不是可以移除 objectClass: posixAccount？

**是的，完全可以移除**，但你需要注意属性之间的"绑定关系"。

如果你只需要这个用户用于 Web 应用登录（如 GitLab, Jenkins, Wiki）或作为电子邮件联系人，而不需要他通过 SSH 或控制台登录 Linux 服务器，移除 `posixAccount` 是更规范的做法。

当你移除 `objectClass: posixAccount` 时，以下属性**必须一并删除**，因为它们属于该类定义的"强制或可选属性"：

- `uidNumber`
- `gidNumber`
- `homeDirectory`
- `loginShell`

此外， `shadowAccount` 通常也与系统登录挂钩，如果不需要管理 Linux 密码过期策略，也可以一并移除。

## 后续建议与管理工具

命令行管理 LDAP 较为繁琐，建议使用以下工具进行可视化操作：

- **phpLDAPAdmin**: 基于 Web 的管理界面，适合快速上手；
- **Apache Directory Studio**: 强大的跨平台桌面客户端，适合复杂的架构设计。
- **安全加固**: 默认情况下 LDAP 是明文传输的，建议配置 **LDAPS (LDAP over SSL/TLS)** 来加密 636 端口的通信。
