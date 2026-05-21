---
title: Setting Up an LDAP Service
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

Setting up an LDAP (Lightweight Directory Access Protocol) server is a core step in implementing enterprise-level **centralised identity authentication** and **permission management**. The most commonly used open-source implementation is **OpenLDAP**.

Below are detailed steps for setting up an OpenLDAP server on Debian/Ubuntu-based Linux systems.

## Environment Preparation and Installation

Before starting, ensure your system packages are up to date and the hostname is properly configured.

```bash
## Update the system
sudo apt update && sudo apt upgrade -y

## Install OpenLDAP and management tools
## slapd is the daemon, ldap-utils is the command-line client tool
sudo apt install slapd ldap-utils -y
```

> During installation, you will be prompted to set the **LDAP administrator password**. Be sure to remember this password — it will be used frequently during configuration.

## Configuring the OpenLDAP Server

Although the installation performs some initial setup, we typically need to customise the configuration for a specific domain (e.g., `example.com`).

### Reconfigure slapd

Run the following command to enter the interactive configuration interface:

```bash
sudo dpkg-reconfigure slapd
```

**Configuration recommendations**:

1. **Omit OpenLDAP server configuration?** Choose **No**.
2. **DNS domain name:** Enter your domain (e.g., `centre.example.com`). This determines your Base DN, such as `dc=centre,dc=example,dc=com`.
3. **Organization name:** Enter your organisation name.
4. **Administrator password:** Enter the administrator password you set earlier.
5. **Database backend:** **MDB** is recommended.
6. **Remove database when slapd is purged?** Choose **No**.
7. **Move old database?** Choose **Yes**.

## Understanding the LDAP Hierarchy

LDAP data is stored in a **tree structure**. To facilitate management, we typically create two "Organisational Units" (OUs): one for users (People) and one for groups (Groups).

## Creating Organisational Units (OUs)

In LDAP, we use **LDIF** (LDAP Data Interchange Format) files to add or modify directory entries.

Create a file named `base.ldif`:

```text
## Create the users organisational unit
dn: ou=people,dc=centre,dc=example,dc=com
objectClass: organizationalUnit
ou: people

## Create the groups organisational unit
dn: ou=groups,dc=centre,dc=example,dc=com
objectClass: organizationalUnit
ou: groups
```

**Import the data:**

```bash
## Import the LDIF file into the database as the administrator
ldapadd -x -D "cn=admin,dc=centre,dc=example,dc=com" -W -f base.ldif
```

## Adding Users and Groups

Create a file named `groups.ldif` to define a new group:

```text
## Define a new group
dn: cn=developers,ou=groups,dc=centre,dc=example,dc=com
objectClass: inetOrgGroup
cn: developers
```

Create a file named `users.ldif` to define a new user:

```text
## Define a new user
dn: uid=jbloggs,ou=people,dc=centre,dc=example,dc=com # The Distinguished Name (DN) of this entry.
objectClass: inetOrgPerson # Object class — inetOrgPerson represents an internet organisation person. It enables common contact attributes such as email, displayName, telephoneNumber, etc.
objectClass: posixAccount # Makes this entry compatible with Unix/Linux system accounts. With it, the user can log into Linux servers and has a UID, GID, and home directory.
objectClass: shadowAccount # Used to manage password ageing (expiry, change warnings, etc.), corresponding to /etc/shadow functionality in Linux.
uid: jbloggs # The user's login name (User ID). This is typically what you enter on the Linux login screen.
sn: Bloggs # Surname. Required by the inetOrgPerson class.
givenName: Joe # First name.
cn: Joe Bloggs # Common Name. The standard display name for an LDAP entry.
displayName: Joe Bloggs # The friendly name displayed in graphical interfaces or email clients.
uidNumber: 10000 # The user's numeric ID in the Linux system.
gidNumber: 5000 # The numeric ID of the user's primary group.
userPassword: {SSHA}password-hash-or-plaintext # The user's encrypted password.
homeDirectory: /home/jbloggs # The path to the user's home directory after logging into Linux.
loginShell: /bin/bash # The shell environment the user gets after logging in.
```

> If you plan to integrate **GitLab**, **Jenkins**, or a **VPN** later, they typically search the `uid` attribute to verify login names.

### FAQ

#### If the user doesn't need server login permissions, can the `objectClass: posixAccount` be removed?

**Yes, it can be completely removed**, but you need to be aware of the "binding relationships" between attributes.

If you only need this user for web application logins (e.g., GitLab, Jenkins, Wiki) or as an email contact, and they don't need to log into a Linux server via SSH or console, removing `posixAccount` is the more standard approach.

When you remove `objectClass: posixAccount`, the following attributes **must also be deleted**, as they belong to that class's mandatory or optional attributes:

- `uidNumber`
- `gidNumber`
- `homeDirectory`
- `loginShell`

Additionally, `shadowAccount` is also typically associated with system logins — if you don't need to manage Linux password expiry policies, it can also be removed.

## Follow-up Suggestions and Management Tools

Command-line LDAP management can be cumbersome. The following tools are recommended for visual administration:

- **phpLDAPAdmin**: A web-based management interface, ideal for quick onboarding.
- **Apache Directory Studio**: A powerful cross-platform desktop client, suitable for complex architecture design.
- **Security Hardening**: By default, LDAP transmits data in plain text. It is recommended to configure **LDAPS (LDAP over SSL/TLS)** to encrypt communication on port 636.
