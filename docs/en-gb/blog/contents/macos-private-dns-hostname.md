---
title: Fix macOS Terminal Host Name Showing IP Segments Under Private DNS
---

In some enterprise or home private network environments, reverse DNS lookups may resolve a device's private IP to a hostname starting with `192`, `172`, or `10`. When this happens, the macOS terminal prompt changes from the normal `user@MacBook-Pro` to something like `user@192-168-1-100`, which can be distracting.

## Cause

When starting a terminal session, macOS performs a reverse DNS lookup to determine the hostname for the current IP address. If the private DNS server returns a hostname derived from IP octets (e.g. `192-168-1-100.example.com`), the system adopts it as the Host Name and the terminal prompt reflects it.

## Fix

Use the built-in `scutil` (System Configuration Utility) to pin the Host Name to your preferred value.

### Check Current State

```shell
# View the current Host Name (may be empty or overridden by DNS)
scutil --get HostName

# View the local Bonjour name
scutil --get LocalHostName

# View the computer name shown in Finder
scutil --get ComputerName
```

### Set the Host Name

```shell
sudo scutil --set HostName "MacBook-Pro"
```

Prefer a name without spaces or special characters, such as `MacBook-Pro`, `My-Mac`, or your device serial number.

### Verify

Open a new terminal window — the value after `@` in the prompt should now show your chosen hostname.

```shell
scutil --get HostName
# Output: MacBook-Pro
```

## Notes

- `HostName` only affects the network-level hostname. `LocalHostName` (Bonjour) and `ComputerName` (Finder display) are managed independently.
- If the issue returns after a reboot, check `/etc/hosts` for conflicting entries or verify whether the DHCP/DNS server continues to push an undesired hostname.
