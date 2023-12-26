---
layout: "@/partials/BasePost.astro"
title: Headless Server with VNC Remote Control
pubDate: 2023-12-26T22:00:00Z
imgSrc: "/img/posts/23-christmas-lab/Virtual_Network_Computing_.svg.png"
imgAlt: "VNC logo"
---

# Headless Server with VNC Remote Control

圣诞节快乐🎉, 当然要同时布置一些好玩的内容来提升孩子们的水平, 现在我就来记录整个完成的过程与解答吧

## 实验内容

购买一个服务器并且安装桌面（gnome，plasma，mate，xfce)，使用vncserver（推荐tigervnc）运行在服务器上，分别使用novnc（运行在服务器上）和VNC viewer（推荐real vnc viewer或者Remmina）链接到服务器的远程桌面.

## 准备

### vnc是什么

VNC（Virtual Network Computing）是一种图形桌面共享系统，它使用远程帧缓冲协议（RFB）来控制另一台计算机的屏幕。通过VNC，用户可以远程查看和操作另一台计算机的桌面界面，就好像坐在前面一样，这使得它成为远程工作、技术支持和教育等多种场合的理想工具。

### vnc有什么用

如上所说, vnc配合桌面图形软件将整个只能无聊输入命令行的服务器, 变成了一台真正的云个人电脑 (没声音的)

### noVNC是什么, 为什么需要它

noVNC是一个开源项目，提供了一种通过Web浏览器访问远程桌面的方式。它实现了VNC（Virtual Network Computing）客户端，使用HTML5的WebSockets和Canvas技术。简而言之，noVNC允许用户**不需要安装任何额外软件**，只需通过现代Web浏览器即可连接和控制远程计算机.
而且配合最基础的普通代理, 由于协议从vnc被转换成了wss, 访问*云电脑*的速度也能飞一般的提升, 而不是卡卡的感觉了.

### 前期配置

一台云服务器, 这里使用debian

```bash
➜  ~ neofetch 
       _,met$$$$$gg.          root@23092809365896nikaidoushinnku 
    ,g$$$$$$$$$$$$$$$P.       ---------------------------------- 
  ,g$$P"     """Y$$.".        OS: Debian GNU/Linux 12 (bookworm) x86_64 
 ,$$P'              `$$$.     Host: OpenStack Nova 23.0.2 
',$$P       ,ggs.     `$$b:   Kernel: 6.1.0-10-amd64 
`d$$'     ,$P"'   .    $$$    Uptime: 44 days, 6 hours, 10 mins 
 $$P      d$'     ,    $$P    Packages: 934 (dpkg) 
 $$:      $$.   -    ,d$$'    Shell: zsh 5.9 
 $$;      Y$b._   _,d$P'      Resolution: 1024x768 
 Y$$.    `.`"Y$$$$P"'         Terminal: /dev/pts/0 
 `$$b      "-.__              CPU: Intel Xeon E5-2696 v4 (1) @ 2.199GHz 
  `Y$$                        GPU: 00:02.0 Cirrus Logic GD 5446 
   `Y$$.                      Memory: 247MiB / 1967MiB 
     `$$b.
       `Y$$b.                                         
          `"Y$b._                                     
              `"""
```

## 操作记录

以 `xfce` 为例子, 先安装桌面系统

