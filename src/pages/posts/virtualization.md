---
layout: "@/partials/BasePost.astro"
title: virtualization configuration
pubDate: 2024-02-14T18:00:00Z
imgSrc: "/img/posts/virtualization/docker-logo.png"
imgAlt: "virtualization configuration"
---

# virtualization configuration

市面上有非常多的容器以及虚拟化运维技术, 这篇文章记载掌握各个常见的命令, 一遍以后配置机器的时候忘掉.

## 1. lxd and lxc container

## 2. docker

## 3. virtualBox Manager

## 4. Qemu with kvm

### installation

```bash
sudo apt install qemu-kvm libvirt-clients libvirt-daemon-system bridge-utils libguestfs-tools genisoimage virtinst libosinfo-bin
sudo adduser shinnku libvirt
sudo adduser shinnku libvirt-qemu
```

`virt-install` 和 `virt-manager` 是两种常用的工具，用于在Linux上管理KVM虚拟机。

`virt-install` 是一个命令行工具，用于创建和配置虚拟机，而`virt-manager`提供了一个图形界面，使得虚拟机的管理更为直观易用。

