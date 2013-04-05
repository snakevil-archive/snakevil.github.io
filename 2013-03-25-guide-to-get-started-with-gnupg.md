---
layout: post
title: "GnuPG 入门教程"
date: 2013-03-25 14:12:00
tags: ["gnupg", "gpg"]
---

近期觅到一篇好文《[A Git Horror Story: Repository Integrity With Signed Commits](http://mikegerwitz.com/docs/git-horror-story.html)》，深得我心。

但 [GnuPG][] 这种工具，估计对于很多人来说，比 [OpenSSL][] 还要生僻。因此整这么一篇基础教程，方便大家入门。不过此教程基于 *Mac OS X* 完成，*Debian* 下测试，因缺乏 *Windows* 环境，请大家自行脑补转译…

[GnuPG]: http://gnupg.org
[OpenSSL]: http://www.openssl.org

<!--{{ site.title }}-->

### 0 安装 [GnuPG][]

这个步骤不用多说，依照个人嗜好来即可。唯一需要注意地是，为了能够与 [Git][] 正常配合工作，请选择 [GnuPG][] 而不是 [GnuPG2][GnuPG] 。

我是通过 [MacPorts][] 做包管理，因此对于我就是 `sudo port install gnupg` 。

### 1 创建个人 [gpg][GnuPG] 钥匙对

千言不如一行。先上实例：

    $ gpg --gen-key
    gpg (GnuPG) 1.4.13; Copyright (C) 2012 Free Software Foundation, Inc.
    This is free software: you are free to change and redistribute it.
    There is NO WARRANTY, to the extent permitted by law.

    gpg: directory `/Users/Snakevil/.gnupg' created
    gpg: new configuration file `/Users/Snakevil/.gnupg/gpg.conf' created
    gpg: WARNING: options in `/Users/Snakevil/.gnupg/gpg.conf' are not yet active during this run
    gpg: keyring `/Users/Snakevil/.gnupg/secring.gpg' created
    gpg: keyring `/Users/Snakevil/.gnupg/pubring.gpg' created
    Please select what kind of key you want:
       (1) RSA and RSA (default)
       (2) DSA and Elgamal
       (3) DSA (sign only)
       (4) RSA (sign only)
    Your selection? 1
    RSA keys may be between 1024 and 4096 bits long.
    What keysize do you want? (2048) 4096
    Requested keysize is 4096 bits
    Please specify how long the key should be valid.
             0 = key does not expire
          <n>  = key expires in n days
          <n>w = key expires in n weeks
          <n>m = key expires in n months
          <n>y = key expires in n years
    Key is valid for? (0) 1y
    Key expires at Tue Mar 25 14:37:40 2014 CST
    Is this correct? (y/N) y

    You need a user ID to identify your key; the software constructs the user ID
    from the Real Name, Comment and Email Address in this form:
        "Heinrich Heine (Der Dichter) <heinrichh@duesseldorf.de>"

    Real name: Snakevil Zen
    Email address: zsnakevil@gmail.com
    Comment: codes signing
    You selected this USER-ID:
        "Snakevil Zen (codes signing) <zsnakevil@gmail.com>"

    Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? o
    You need a Passphrase to protect your secret key.

    We need to generate a lot of random bytes. It is a good idea to perform
    some other action (type on the keyboard, move the mouse, utilize the
    disks) during the prime generation; this gives the random number
    generator a better chance to gain enough entropy.
    .....................+++++
    +++++
    We need to generate a lot of random bytes. It is a good idea to perform
    some other action (type on the keyboard, move the mouse, utilize the
    disks) during the prime generation; this gives the random number
    generator a better chance to gain enough entropy.
    +++++
    ..........................+++++
    gpg: /Users/Snakevil/.gnupg/trustdb.gpg: trustdb created
    gpg: key 1B2B5D40 marked as ultimately trusted
    public and secret key created and signed.

    gpg: checking the trustdb
    gpg: 3 marginal(s) needed, 1 complete(s) needed, PGP trust model
    gpg: depth: 0  valid:   1  signed:   0  trust: 0-, 0q, 0n, 0m, 0f, 1u
    gpg: next trustdb check due at 2014-03-25
    pub   4096R/1B2B5D40 2013-03-25 [expires: 2014-03-25]
          Key fingerprint = 5829 B9FA B278 AEE4 EADF  83E3 269F E0BE 1B2B 5D40
    uid                  Snakevil Zen (codes signing) <zsnakevil@gmail.com>
    sub   4096R/E63A1A95 2013-03-25 [expires: 2014-03-25]

整个过程中需要选择或输入地内容依次为：

1. 算法， _肯定是当下使用最为广泛地 [RSA][] 算法，_ 选择 **1**

2. 密钥长度， _需要计算签名的代码版本数据并不算长，而当下的硬件又在飞速提高，_ 选择 **4096**

3. 有效期， _为了避免各种天灾（如：硬盘损坏、误删、备份丢失）带来地干扰，建议一年足矣，_ 选择 **1y**

4. 有效期确认，选择 **y**

5. 真实姓名， _写出好的代码并传播，是一件光荣的事情，就该用真名，但请使用英文名或拼音以确保兼容性，_ **自行输入**

6. 邮件地址， _此邮件地址是钥匙对的关键指标，做签名或加密时一定要与其相应的邮件地址对应，因此切不要输错，_ **自行输入**

7. 注释说明， _建议填上该钥匙对的作用，是开车库门还是保险箱门 :-p，没有什么更好地选择就和我一样『codes signing』也行_ **自行输入**

8. 最终确认，选择 **o**

9. **两次输入密码**

【说明】 **我个人用于 [Git][] 代码签名的 [gpg][GnuPG] 公钥是 `2048R/FBB11BB6` ，优先服务器是 `hkp://keys.gnupg.net` 。** 此实例中生成的钥匙对仅用于演示。

### 2 创建注销钥匙（Revoke Key）

有过买新房经历的童鞋应该有这样的了解：大门钥匙会有两种，优先使用地是装修钥匙，入住之后换用正式钥匙。使用过正式钥匙之后，装修钥匙就作废了。

注销钥匙之于钥匙对，就有点像正式钥匙之于装修钥匙。虽然这样地说法有点不精准，但容易理解。 _其不精准之处就在于注销钥匙其实更像是专门恶心人地泡泡糖，往锁（钥匙对）里一插，就谁都别想用这把锁了。_

为了避免各种人祸，那么就有必要在钥匙对使用前，先得到其相应的注销钥匙，以防万一。

    $ gpg --output revoke.asc --gen-revoke zsnakevil@gmail.com

    sec  4096R/1B2B5D40 2013-03-25 Snakevil Zen (codes signing) <zsnakevil@gmail.com>

    Create a revocation certificate for this key? (y/N) y
    Please select the reason for the revocation:
      0 = No reason specified
      1 = Key has been compromised
      2 = Key is superseded
      3 = Key is no longer used
      Q = Cancel
    (Probably you want to select 1 here)
    Your decision? 1
    Enter an optional description; end it with an empty line:
    > A thief stolen my password and the private key.
    >
    Reason for revocation: Key has been compromised
    A thief stolen my password and the private key.
    Is this okay? (y/N) y

    You need a passphrase to unlock the secret key for
    user: "Snakevil Zen (codes signing) <zsnakevil@gmail.com>"
    4096-bit RSA key, ID 1B2B5D40, created 2013-03-25

    ASCII armored output forced.
    Revocation certificate created.

    Please move it to a medium which you can hide away; if Mallory gets
    access to this certificate he can use it to make your key unusable.
    It is smart to print this certificate and store it away, just in case
    your media become unreadable.  But have some caution:  The print system of
    your machine might store the data and make it available to others!

整个过程中需要选择或输入地内容依次为：

1. 操作确认，输入 **y**

2. 注销原因，输入 **1**

3. 原因描述， _此项可选，如懒得写也可以忽略，_ **输入内容后连续回车两次**

4. 原因确认，输入 **y**

5. **输入密码**

【警告】**请务必妥善保管好生成的 `revoke.asc` 文件。**

### 3 广而告之

将公钥发布到公网服务器，以便和你有交流的童鞋可以更方便地得到你的密钥。

```sh
gpg --send-keys 1B2B5D40
```

因为是实例的关系，我就没有真地执行这条指令，进而也就没有相应的输入结果可以复制做演示。

不过此处没有需要输入地内容，因此不用担心会出什么问题。

### 4 体系理解

#### I 你对其他人的公钥进行签名，可以提高他的可信度

#### II 签名是公钥的附加信息，会自动合并而不是覆盖

#### III 公钥的提交不检验是否为公钥所有者

#### IV 所有的公钥服务器组成主主网络，相互更新同步

#### V 服务器上的公钥无法被删除

[Git]: https://git.wiki.kernel.org/index.php/Git_FAQ
[MacPorts]: http://www.macports.org
