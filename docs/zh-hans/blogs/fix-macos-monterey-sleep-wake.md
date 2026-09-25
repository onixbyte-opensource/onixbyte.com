---
title: 解决 macOS Monterey+ 设备休眠频繁自动唤醒的问题
tags:
  - macos
  - sleep
  - power-management
  - bug
---

> 本文由 **落格博客** 原创撰写：[落格博客](https://www.logcg.com/) » [升级 macOS Monterey 后设备休眠半夜频繁唤醒问题](https://www.logcg.com/archives/3528.html)

更新到了 macOS Monterey，半夜总会被屏幕照醒，就觉得很诡异，以前也有过，但都是有通知的时候才会点亮屏幕，现在是没有任何理由的自己点亮，硬件还是那个硬件，那就应该是软件的锅了。

在网上查了一圈，先是找到了[苹果官方的教程](https://support.apple.com/zh-cn/guide/mac-help/mchlp2995/mac)。写的很详细，但显然是没有任何用处的。

于是继续深挖，还真找到了原因，使用命令 **`pmset -g log | grep DarkWake`** 就可以看到，在你睡觉的过程中，你的 Mac 并没有歇着……

看看输出，这几个比较典型，大部分都是这样的，一个 DarkWake， 一个 Wake， 两个仅仅相连，那么问题就出来了， DarkWake 是给电脑在后台唤醒来更新数据的，但不知怎么的，外设被触发，从而导致了全局唤醒。

总之，我并不想要这个功能， 就那个 PowerNap，对我来说，我更希望它能给我多省点电，于是大概解决思路就这么多：关掉网络访问唤醒，关掉 PowerNap……不过问题来了，在 m1 设备上，其实是没有 PowerNap 选项的……（显然，苹果对自己的续航很有信心，但他们忽略了Bug的威力）

于是对于 PowerNap 这个功能来说，我们只能从命令行下手，首先使用 **`pmset -g`** 命令查看当前状态，找到 **`powernap`** 的值，如果不是 0 ，说明是启用的状态，使用命令 **`sudo pmset -a powernap 0`** 关掉它。

同时，还有另外一个 **`tcpkeepalive`** ，这个默认应该也不是 0 ，也要关掉，它决定了你的 rmbp 在休眠时是否要保持 tcp 连接。 **`sudo pmset -a tcpkeepalive 0`** ，执行这条命令会导致终端提示：**_Warning: This option disables TCP Keep Alive mechanism when system is sleeping. This will result in some critical features like 'Find My Mac' not to function properly._**

大概是说关了的话某些功能会受到限制，其实就是系统功能不能休眠时联网了，我相信真有人偷了你 Mac，它也连不上网的。
