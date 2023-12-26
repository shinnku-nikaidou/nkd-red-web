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

一台云服务器, 这里使用 debian

```bash
➜  ~ neofetch 
       _,met$$$$$gg.          root@lab.nkd.red 
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

### 安装桌面系统

以 `xfce` 为例子, 先安装桌面系统 (嗨呀, 都看到这里了, 记得收藏真红姐姐的站点)

```bash
sudo apt update && sudo apt -y upgrade
sudo apt install -y tasksel

# 如果您是ubuntu系统, 可以直接 (诶, 我不是在用debian吗)
sudo tasksel install xubuntu-desktop 

# 如果是其他系统(包括ubuntu)
sudo tasksel
# 然后选中 xfce, 按下 enter

sudo apt install gtk2-engines
```

### 记录vnc的安装

#### 无用的内容

下面是一些无用的内容, 感兴趣的同学也可以猜猜是做了啥

```bash
export LIBGL_ALWAYS_INDIRECT=1
sudo /etc/init.d/dbus start &> /dev/null
```

把这段话写进 `~/.bashrc` 或者 `~/.zshrc` 里面.

You can also create a file called `/etc/sudoers.d/dbus` and add the following in it using your username

```bash
your_user_name ALL = (root) NOPASSWD: /etc/init.d/dbus
```

This does come with risks but it should be **ok** for most.

### install vncserver

```bash
apt install tigervnc-standalone-server tigervnc-xorg-extension tigervnc-scraping-server
```

这是 vncserver 的 help (摆在这里假装博客内容很多):

```bash
➜  ~ vncserver --help
vncserver usage:

  Help can be found in vncserver(1), or via usage of
     -help                   if specified, dumps this help message.
     -h                      is an alias for help.
     -?                      is an alias for help.
  
  To start a VNC server use vncserver [options] [-- session]
    [:<number>]              specifies the X11 display to be used.
    [-display <value>]       is an alias for :<number>.
    [-fg]                    if enabled, vncserver will stay in the foreground.
    [-useold]                if given, start a VNC server only if one is not already running.
    [-verbose]               if specified, debugging output is enabled.
    [-dry-run]               if enabled, no real action is taken only a simulation of what would be done is performed.
    [-PAMService <value>]    specifies the service name for PAM password validation that is used in case of security types Plain, TLSPlain, or X509Plain. On
                             default, vnc is used if present otherwise tigervnc is used.
    [-pam_service <value>]   is an alias for PAMService.
    [-PlainUsers <value>]    specifies the list of authorized users for the security types Plain, TLSPlain, and X509Plain.
    [-localhost [yes|no]]    if enabled, VNC will only accept connections from localhost.
    [-desktop <value>]       specifies the VNC desktop name.
    [-rfbport <number>]      provides the TCP port to be used for the RFB protocol.
    [-rfbunixpath <value>]   specifies the path of the Unix domain socket to be used for the RFB protocol.
    [-rfbunixmode <value>]   specifies the mode of the Unix domain socket, default is 0600.
    [-X509Key <value>]       denotes a X509 certificate key file (PEM format). This is used by the security types X509None, X509Vnc, and X509Plain.
    [-X509Cert <value>]      denotes the corresponding X509 certificate (PEM format).
    [-PasswordFile <value>]  specifies the password file for security types VncAuth, TLSVnc, and X509Vnc. On default, ~/.vnc/passwd is used.
    [-rfbauth <value>]       is an alias for PasswordFile.
    [-SecurityTypes <value>] specifies a comma list of security types to offer (None, VncAuth, Plain, TLSNone, TLSVnc, TLSPlain, X509None, X509Vnc,
                             X509Plain). On default, offer only VncAuth.
    [-geometry <value>]      specifies the desktop geometry, e.g., <width>x<height>.
    [-wmDecoration <value>]  if specified, shrinks the geometry by the given <width>x<height> value.
    [-xdisplaydefaults]      if given, obtain the geometry and pixelformat from a running X server.
    [-xstartup [<value>]]    specifies the script to start an X11 session for Xtigervnc.
    [-noxstartup]            disables X session startup.
    [-depth <number>]        specifies the bit depth of the desktop, e.g., 16, 24, or 32.
    [-pixelformat <value>]   defines the X11 server pixel format. Valid values are rgb888, rgb565, bgr888, or bgr565.
    [-autokill [yes|no]]     if enabled -- the default -- the VNC server is killed after its X session has terminated.
    [-fp <value>]            specifies a colon separated list of font locations.
    [Xtigervnc options...]   For details, see Xtigervnc(1).
    [-- <session>]           specifies the X11 session to start with either a command or a session name.
  
  To list all active VNC servers of the user use vncserver
     -list                   if provided, all active VNC servers of the user are listed.
    [:<number>]              specifies the X11 display to be used.
    [-display <value>]       is an alias for :<number>.
    [-rfbport <number>]      provides the TCP port to be used for the RFB protocol.
    [-rfbunixpath <value>]   specifies the path of the Unix domain socket to be used for the RFB protocol.
    [-cleanstale]            if provided, clean up pid and lockfiles of stale VNC server instances of the user.
  
  To kill a VNC server use vncserver
     -kill                   if provided, kill the specified VNC server of the user.
    [:<number>]              specifies the X11 display to be used.
    [-display <value>]       is an alias for :<number>.
    [-rfbport <number>]      provides the TCP port to be used for the RFB protocol.
    [-rfbunixpath <value>]   specifies the path of the Unix domain socket to be used for the RFB protocol.
    [-dry-run]               if enabled, no real action is taken only a simulation of what would be done is performed.
    [-verbose]               if specified, debugging output is enabled.
    [-clean]                 if specified, the log files of the terminated VNC session will also be removed.
  
  To dump version information use vncserver
    [-version]               dumps version information of underlying Xtigervnc VNC server.
  
```

接下来, 输入

```bash
➜  ~ vncserver -localhost no

You will require a password to access your desktops.

Password:
Verify:
Would you like to enter a view-only password (y/n)? n
A view-only password is not used
/usr/bin/xauth:  file /root/.Xauthority does not exist

New Xtigervnc server 'lab.nkd.red:1 (root)' on port 5901 for display :1.
Use xtigervncviewer -SecurityTypes VncAuth,TLSVnc -passwd /tmp/tigervnc.TJqJuC/passwd lab.nkd.red:1 to connect to the VNC server.
```

然后就是展示成果的时候:

![macos的 vnc viewer 软件界面](/img/posts/23-christmas-lab/vnc-1.jpg)

macos的 vnc viewer 软件界面

-----

![与服务器的 vnc server 连接成功](/img/posts/23-christmas-lab/vnc-2.jpg)

与服务器的 vnc server 连接成功

## 安装 novnc

下次再说.
