---
title: 修复 macOS 终端在私网 DNS 下 Host Name 显示为 IP 段的问题
tags:
  - macos
  - dns
  - terminal
---

在部分企业或家庭私网环境中，DNS 反向解析会将设备的私网 IP 映射为一个以 `192`、`172` 或 `10` 开头的主机名。此时 macOS 终端提示符会从正常的 `user@MacBook-Pro` 变为 `user@192-168-1-100` 这样的形式，影响日常使用体验。

## 原因

macOS 在启动终端会话时会通过反向 DNS 查询当前 IP 对应的主机名。当私网 DNS 服务器返回了一个基于 IP 段拼凑的主机名（例如 `192-168-1-100.example.com`）时，系统便会采纳该名称作为 Host Name，终端提示符随之改变。

## 修复方法

使用 macOS 自带的 `scutil`（System Configuration Utility）即可将 Host Name 固定为你期望的值。

### 查看当前状态

```shell
# 查看当前 Host Name（可能为空或已被 DNS 改写）
scutil --get HostName

# 查看本地 Bonjour 名称
scutil --get LocalHostName

# 查看 Finder 中显示的计算机名
scutil --get ComputerName
```

### 设置 Host Name

```shell
sudo scutil --set HostName "MacBook-Pro"
```

建议使用不含空格和特殊字符的名称，例如 `MacBook-Pro`、`My-Mac` 或你的设备序列号。

### 验证修改

重新打开一个终端窗口，提示符中的 `@` 后面应恢复为你设置的主机名。

```shell
scutil --get HostName
# 输出: MacBook-Pro
```

## 补充说明

- `HostName` 仅影响网络层面的主机名标识，不会影响 `LocalHostName`（Bonjour 本地名称）和 `ComputerName`（Finder 显示名），三者独立管理。
- 若问题在重启后复现，可以检查 `/etc/hosts` 中是否有相关条目，或确认 DHCP/DNS 服务器是否持续下发不期望的主机名。
