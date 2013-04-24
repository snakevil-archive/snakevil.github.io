---
layout: post
title: "Git 子模块功能的两种玩法"
date: 2013-04-23 15:51:36+08:00
tags:
  - git
  - git-submodule
keywords:
  - 子模块
---

虽然已经在 [博客程序的版本库](https://github.com/snakevil/snakevil.github.io.git) 中使用到了 [Git][] 的子模块功能，但纯属玩票性质，实践中多次碰到一些莫名奇妙的问题。

仔细研读了《 [Pro Git](http://git-scm.com/book/zh) 》一书的《 [6.6 Git 工具 - 子模块](http://git-scm.com/book/zh/Git-%E5%B7%A5%E5%85%B7-%E5%AD%90%E6%A8%A1%E5%9D%97) 》章节，但仍未能成功领悟到其中的奥义…倒是从《 [子模块的问题](http://git-scm.com/book/zh/Git-%E5%B7%A5%E5%85%B7-%E5%AD%90%E6%A8%A1%E5%9D%97#子模块的问题) 》一段学到了发生特定的错误时该如何修补。

在多次出现问题并死磕之后，感觉终于略有心得了。因此借鉴孔乙己大爷的“茴字的四种写法”一说，记录所得的两种玩法。

[Git]: https://git.wiki.kernel.org/index.php/Git_FAQ

<!--more-->

## 0 尴尬表象 ##

正如《 [6.6 Git 工具 - 子模块](http://git-scm.com/book/zh/Git-%E5%B7%A5%E5%85%B7-%E5%AD%90%E6%A8%A1%E5%9D%97) 》所述的方法，无论你乐意还不是不乐意，检出相应的带子模块的 [Git][] 版本库终归需要执行：

{% highlight sh linenos=table %}
git clone 'REPOSITORY-URL' 'WORKING-DIRECTORY'
cd 'WORKING-DIRECTORY'
git submodule init
git submodule update
{% endhighlight %}

但这是进入子模块相应的目录并执行 `git status` ，就一定会出现这样的尴尬：

![Not currently on any branch.](/s/a/4/two-ways-of-playing-with-git-submodules-1.png)

不过此情况已在《 [子模块的问题](http://git-scm.com/book/zh/Git-%E5%B7%A5%E5%85%B7-%E5%AD%90%E6%A8%A1%E5%9D%97#子模块的问题) 》中描述过了，多看两次也能麻木。但更大的问题在于：

1. 我能够直接集成开发子模块吗？

2. 如何快速级联更新子模块的子模块？

## 1 解决方案 ##

针对这两个问题，将工作方法从目标角度划分成两种：

### a 开发环境 ###

在开发环境中，我可以容忍第二个问题，但第一个问题是必须解决地。

比较靠谱的做法，是根据 `git submodule --recursive` 的结果，手动在每一个子模块对应的目录执行一次 `git checkout 'BRANCH'` 操作。该工作也可以使用下段脚本来完成（我的默认 [`awk`](http://en.wikipedia.org/wiki/AWK) 是 [`gawk`](http://linux.die.net/man/1/gawk) ）。

{% highlight sh linenos=table %}
git submodule status --recursive | \
  awk '{i=split(substr($3,2,length($3)-2),j,"/");print $2,j[i]}' | \
  while read dir branch; do
    cd $dir
    git checkout $branch
    cd -
  done
{% endhighlight %}

这时每个子模块目录都已指向了其对应的版本库的对应分支。只要具有子模块的提交权限，对该子模块的集成开发就不是什么问题。

假设另外的协作者已经向主版本库和（或）子版本库提交了新代码版本，可以使用 `git pull --recurse-submodules=on-demand` 来 _半自动_ 更新—— 对于子模块而言，执行地是 `fetch` 而非 `pull` ——然后同样需要手动操作（自动化脚本与上面的大体一致）。

### b 应用环境 ###

在应用环境中，第一个问题就可以被忽略掉，从而聚焦在第二个问题上。

与开发环境下的级联更新相似。只是因为我们不用修改和提交代码，所以我们也就不用关注每个子模块是否指向了对应版本库的对应分支。两条指令搞定一切〜

{% highlight sh linenos=table %}
git pull --recurse-submodules=yes
git submodule update --recursive
{% endhighlight %}

## 2 添加子模块 ##

回溯到添加子模块的阶段，请务必注意这一个细节点——**一定要指明对应分支！**——即：

{% highlight sh %}
git submodule add -b 'BRANCH' 'REPOSITORY-URL' 'PATH'
{% endhighlight %}

只有这样，在查看 `git submodule status --recursive` 时，输出结果才会是（注意红色涂抹部分）：

![Submodules with Specified Branch](/s/a/8/two-ways-of-playing-with-git-submodules-3.png)

否则就成了：

![Submodules without Branch](/s/a/d/two-ways-of-playing-with-git-submodules-2.png)
