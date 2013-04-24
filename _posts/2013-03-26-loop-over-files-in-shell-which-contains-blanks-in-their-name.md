---
layout: post
title: "Shell 遍历带空格的文件列表"
date: 2013-03-26 20:15:00+08:00
tags:
  - "shell"
  - "git"
  - "linux"
keywords:
  - "bash"
  - "gnu"
  - "gitconfig"
  - "github"
---

近期在 [Git][] 全局配置中新增了一个仿 `ls` 的别名，使用 shell 实现，其显示效果类似于 [GitHub][] 。但在处理带空格的文件时，发现一些问题。因此又做了一些修正。

![Sample of Git `LS`](/s/a/c/sample-of-git-ls.png)

[Git]: https://git.wiki.kernel.org/index.php/Git_FAQ
[GitHub]: https://github.com

<!--more-->

其代码如下：

{% highlight sh linenos=table %}
cd "${GIT_PREFIX}";
maxlen=$(
	'git' ls-tree --name-only HEAD . | while read file; do
		'ls' -DF "$file";
	done | 'wc' -L
);
'git' ls-tree --name-only HEAD . | while read file; do
	[ -e "$file" ] || continue
	len=$( 'ls' -dF "$file" | 'wc' -c )
	clen=$( 'ls' -dF --color "$file" | 'wc' -c )
	[ 's' == "s$('git' log -1 --pretty='%G?' "$file")" ] && \
		tpl=' ' || \
		tpl='%C(red normal ul)%G?%Creset'
	'printf' "%-$( 'expr' $maxlen + $clen - $len )s" "$( 'ls' -dF --color "$file" )"
	'git' log -1 --pretty=" %C(yellow normal)%h%Creset $tpl %C(white normal)%s%Creset %C(blue normal)[%an]%Creset %C(black normal bold)%ar%Creset" "$file" | 'head'
done
{% endhighlight %}

被修正的问题有三：

1. 使用 `wc -L` 快速计算所有行中最长一行的字符数；

2. 使用 `while read` 替换 `for` 避开以空格作为间隔符的尴尬；

3. 使用 `$()` 为 `$maxlen` 赋值避开管道的 sub-shell 问题。
