---
layout: post
title: "Git 与 GnuPG2 配合地 pinentry-curses 错误"
date: 2013-03-25 12:09:00
tags: ["git", "gnupg", "gnupg2", "gpg", "pinentry-curses"]
---

前几天为了进一步保障 [Git][] 版本的可靠性，加上了 [gpg][GnuPG][^1] 的签名。

当时在 [MacPorts][] 中选择的 [GnuPG][] 版本是较新的 `gnupg2 @2.0.19` 。结果每次在做 `git commit -veS` 操作时都会碰到这样的问题：

    $ git ci

    You need a passphrase to unlock the secret key for
    user: "Snakevil Zen (codes signing) <zsnakevil@gmail.com>"
    2048-bit RSA key, ID FBB11BB6, created 2013-03-21

    pinentry-curses: no LC_CTYPE known - assuming UTF-8
                                                        pinentry-curses: no LC_CTYPE known - assuming UTF-8
                                                                                                            pinentry-curses: no LC_CTYPE known - assuming UTF-8
                                        pinentry-curses: no LC_CTYPE known - assuming UTF-8

    gpg: signal Interrupt caught ... exiting

网上找了很久，都没有对应的资料。但这么玩的哥们绝对多到不行，为什么会没有问题呢？

**当时为了先做正事，避免被耽搁，被迫删除了私钥的密码。**

之后在 [Git][] 中尝试设置 `gpg.program` ，无效。尝试翻 [GnuPG2][GnuPG] 的文档，无果。尝试将 `gpg2` 软链到 `gpg` …最后暂时性地放弃了。

而今天抽了点功夫，很土鳖地又安装了 `gnupg @1.4.13`，然后重设 [gpg][GnuPG] 私钥密码。

**问题居然自然消失了！**

看来只能说 [Git][] 和 [GnuPG2][GnuPG] 还没有形成配合默契，老老实实继续用 [GnuPG][] 吧。

[^1]: `gpg`全名`The GNU Privacy Guard`，是 [GNU](http://www.gnu.org) 版本的 `pgp`（`Pretty Good Privacy`）。

[git]: https://git.wiki.kernel.org/index.php/Git_FAQ
[GnuPG]: http://gnupg.org
[MacPorts]: http://www.macports.org
