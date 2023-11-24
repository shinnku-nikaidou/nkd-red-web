---
layout: '@/partials/BasePost.astro'
title: Make effective ddos attack
pubDate: 2023-11-01T00:00:00Z
imgSrc: '/img/posts/common-ddos-tools/slowlori-1.png'
imgAlt: 'common ddos tools'
---
# Make effective ddos attack

## content

- 如何获取足够大的流量（网络）
- 常见 ddos 工具集介绍
- 如何绕过 CDN 找到源站
- 常用网站

## 如何获取足够大的流量

你需要白嫖非常多的类似于 `EC2` 的服务。准备 **指纹浏览器** ，或者 **虚拟机** 很多个。
比如我就有 16 台虚拟机可以同时开启。

> 指纹浏览器是什么： （gpt4 with bing generated）
> 指纹浏览器，或称为 Fingerprinting Browser，是一种特殊的浏览器技术，主要用于识别和跟踪网站访问者。
> 指纹浏览器能够让用户在同一台电脑或手机上登录多个账号，而彼此账号间不关联。这种防关联的功能主要应用于跨境电商和社交账号营销。通过使用指纹浏览器，可以保证数据之间的安全，防止账号间的数据关联，并且能够更改数据信息，如时区和地址等。

好了，这时候准备 16 个 google 账户和 16 个 microsoft 分别进行登陆。
登陆常见程序员网站

### 常见的可以用来白嫖算力的地方

1. [google colab](https://colab.google/)
2. [microsoft github codespaces](https://github.com/features/codespaces)
3. [cloudflare worker](https://workers.cloudflare.com/)

## 常见 ddos 工具集介绍

### webBenchmark

> [https://github.com/maintell/webBenchmark](https://github.com/maintell/webBenchmark)

#### usage

```sh
webBenchmark -c [COUNT] -s [URL] -r [REFERER]
-c int
      concurrent routines for download (default 16)
-r string
      referer url
-s string
    target url (default "https://baidu.com")
-i string
      custom ip address for that domain, multiple addresses automatically will be assigned randomly
-H http header pattern
      http header pattern, use Random with number prefix will generate random string, same key will be overwritten
-f string
      randomized X-Forwarded-For and X-Real-IP address
-p string
      post content
```

### slowloris

what is slowloris: [cloudflare link](https://www.cloudflare.com/learning/ddos/ddos-attack-tools/slowloris/)

![](/img/posts/common-ddos-tools/slowlori-1.png)

## 如何绕过 CDN 找到源站

### 采用多地 ping

- [https://ping.chinaz.com/](https://ping.chinaz.com/)

### 爆破扫描所有 3 级域名 (ksubdomain)

> [ksubdomain](https://github.com/knownsec/ksubdomain)

ksubdomain 是一款基于无状态子域名爆破工具，支持在 Windows/Linux/Mac 上使用，它会很快的进行 DNS 爆破，在 Mac 和 Windows 上理论最大发包速度在 30w/s,linux 上为 160w/s 的速度。

ksubdomain 的发送和接收是分离且不依赖系统，即使高并发发包，也不会占用系统描述符让系统网络阻塞。

可以用 `--test`来测试本地最大发包数,但实际发包的多少和网络情况息息相关，ksubdomain 将网络参数简化为了 `-b`参数，输入你的网络下载速度如 `-b 5m`，ksubdomain 将会自动限制发包速度。

### 查看域名历史解析记录

因为域名在上 CDN 之前用的 IP，很有可能就是 CDN 的真实源 IP 地址。

[http://toolbar.netcraft.com/](http://toolbar.netcraft.com/)

### 其他

判断 `HTTP_X_FORWARDED_FOR` 是否为空，不为空把这个作为 IP 地址，否则取得 `REMOTE_ADDR` 作为 IP 地址。

如果服务器可以上传文件，可上传文件加如下代码：

`Request.ServerVariables(“LOCAL_ADDR”)` 得到服务器的 IP 地址
`Request.ServerVariables(“REMOTE_ADDR”)` 得到客户端的 IP 地址/这个有可能是代理
`request.ServerVariables(“HTTP_X_FORWARDED_FOR”)` 得到请求客户端真实 IP 地址

让服务器主动连接我们（包括 RSS 邮件订阅）

我们直接访问有 cdn 的域名的时候，肯定要先经过 cdn，如果我们让服务器连接我们呢??不就能快速得到服务器真实 IP 了么？

不管网站怎么 CDN，其向用户发的邮件一般都是从自己服务器发出来的。有的服务器本地自带 sendmail，注册之后，会主动发一封邮件给我们，打开邮件的源代码，你就能看到邮件服务器的真实 Ip 了，很大可能与主站处在一个网段，那个网段打开 80 端口的一个一个试。

## 常用网站

### isitdownrightnow

[https://www.isitdownrightnow.com/](https://www.isitdownrightnow.com/)

检测网站是否正确仍然能正常打开。

### Google Public DNS

[https://dns.google/](https://dns.google/)

查询 域名的 nsloopup 结果， A AAAA CNAME NS MX 等
