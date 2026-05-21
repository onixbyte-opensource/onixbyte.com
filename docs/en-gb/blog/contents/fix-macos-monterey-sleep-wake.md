---
title: Fix macOS Monterey+ Devices Waking Frequently from Sleep
tags:
  - macos
  - sleep
  - power-management
  - bug
---

> This article was originally written by **落格博客
**: [落格博客](https://www.logcg.com/) » [Frequent Wake-from-Sleep Issues After Upgrading to macOS Monterey](https://www.logcg.com/archives/3528.html)

After upgrading to macOS Monterey, my screen kept lighting up in the middle of the night for no apparent reason. It had
happened before, but only when notifications came in. Now the screen lights up on its own with no trigger — same
hardware, so it must be a software issue.

After searching online, I first
found [Apple's official guide](https://support.apple.com/en-gb/guide/mac-help/mchlp2995/mac). It's very detailed, but
clearly of no help whatsoever.

Digging deeper, I found the root cause. Run **`pmset -g log | grep DarkWake`** and you'll see your Mac hasn't been
resting while you slept...

Several typical patterns appear, most with a DarkWake immediately followed by a Wake. The issue: DarkWake is meant to
wake the computer in the background to update data, but somehow a peripheral gets triggered, causing a full system wake.

In any case, I don't want this feature — Power Nap. For me, I'd rather it save as much power as possible. The fix path:
disable network access wake, disable Power Nap... But here's the catch — on M1 devices, there is no Power Nap option in
settings. (Clearly, Apple is confident in their battery life but overlooked the power of bugs.)

So for Power Nap, we have to go through the command line. First, check the current status with **`pmset -g`**. Find the
**`powernap`** value — if it isn't 0, it's enabled. Disable it with **`sudo pmset -a powernap 0`**.

Also check **`tcpkeepalive`** — it likely isn't 0 either and should also be turned off. It controls whether your Mac
maintains TCP connections while sleeping. Run **`sudo pmset -a tcpkeepalive 0`** — you'll see a terminal warning:
***Warning: This option disables TCP Keep Alive mechanism when system is sleeping. This will result in some critical
features like 'Find My Mac' not to function properly.***

Essentially, turning it off limits some features — the system simply won't connect to the network while asleep. I'm
fairly confident that if someone actually steals your Mac, they won't be getting it online anyway.
