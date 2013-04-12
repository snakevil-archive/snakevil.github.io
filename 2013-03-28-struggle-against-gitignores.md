---
layout: post
title: "与 .gitignores 的艰苦卓绝地斗争"
date: 2013-03-28 11:45:00+08:00
tags: ["git", "tox"]
excerpt: 玩 Git 这么久，一直都会觉得 `.gitignore` 是一种很神奇的、难以琢磨地配置。你永远不知道下一条规则会被如何处理…
---

今天趁着整理 [Tox][] 项目 `.gitattributes` 配置的机会，也想梳理一下已有的 `.gitignore` 配置。然后很不幸地，再度陷入了与 `.gitignore` 艰苦卓绝地斗争。

## 了解 `git-status`

自 [Git][] 1.6 开始，`git status` 会使用如下的指令以检查哪些文件会被忽略（*REF: [Show ignored files in git on stackOverflow](http://stackoverflow.com/questions/466764/show-ignored-files-in-git)*）：

{% highlight sh %}
'git' ls-files -o -i --exclude-standard
{% endhighlight %}

但这对我们该如何更好地编写 `.gitignore` 配置毫无帮助——你知其然而不知其所以然。

[Tox]: https://github.com/php-tox/tox
[Git]: https://git.wiki.kernel.org/index.php/Git_FAQ

<!--{{ site.title }}-->

## 未来可期的 `git-check-ignore`

翻回 [Git][] 的 manpage ，可以找到这样一条指令：

{% highlight sh %}
'git' check-ignore --verbose --stadin < <list-of-paths>
{% endhighlight %}

*注：该子命令引入自 1.8.2 版本（REF: [git-check-ignore(1) Manpage on Google Code](https://code.google.com/p/git-core/source/browse/Documentation/git-check-ignore.txt?name=v1.8.2)），也是此时最新的版本。*

需要注意地是，无论是从什么地方开始执行这个指令，它都会认为当前目录是根目录（*在 [Git][] 配置中可直接使用 `$GIT_PREFIX` 环境变量，外部 shell 中使用 `'git' rev-parse --show-toplevel`（REF: [Line 40 of snakevil/bashrc.x/src/etc/bashrc.d/95-prompt-vcs-git.sh on Github](https://github.com/snakevil/bashrc.x/blob/master/src/etc/bashrc.d/95-prompt-vcs-git.sh#L40)） 取得*），然后向深处开始寻找 `.gitignore` 配置…（见下图）！

![Mad git-check-ignore on 1.8.2](/s/a/1/mad-git-check-ignore-on-1_8_2.png)

## 温故 `gitignore`

在 1.8.2 版本的 [manpage]() 中，总共规约了 **11** 种模式。*从内容描述上来看，应该是按照优先级由高到低所排列：*

> * A blank line matches no files, so it can serve as a separator for readability.

**0** 空行不作为模式参与匹配，因此可作为提高可读性的分段符。

> * A line starting with `#` serves as a comment. Put a backslash `\` in front of the first hash for patterns that begin with a hash.

**1** 以 `#` 字符打头的行是注释。如果需要将该字符用于匹配，将在行首添加一个反斜线字符 `\` 。

> * An optional prefix `!` which negates the pattern; any matching file excluded by a previous pattern will become included again. If a negated pattern matches, this will override lower precedence patterns sources. Put a backslash `\` in front of the first `!` for patterns that begin with a literal `!`, for example, `\!important!.txt`.

**2** 行首为 `!` 字符时处理为反向模式。若某文件被之前的另一模式排除掉，那么经过此模式地处理，会被重新包含进来。被反向模式匹配的文件，会跳过后继其它低优先级的模式。如果需要匹配文件首字符为 `!` 的文件，需要在模式行首的 `!` 字符前添加一个反斜线字符 `\` 。如： `\!important!.txt` 。

> * If the pattern ends with a slash, it is removed for the purpose of the following description, but it would only find a match with a directory. In other words, `foo/` will match a directory `foo` and paths underneath it, but will not match a regular file or a symbolic link `foo` (this is consistent with the way how pathspec works in general in [Git][]).

**3** 如果模式以斜线字符 `/` 结尾，在处理时该字符会从模式中移除，但它强调了该模式仅作用于目录。换而言之， `foo/` 会匹配目录 `foo` 及其中的其它目录和文件的路径，但不会匹配文件或符号链接 `foo` 。

> * If the pattern does not contain a slash `/`, [Git][] treats it as a shell glob pattern and checks for a match against the pathname relative to the location of the `.gitignore` file (relative to the toplevel of the work tree if not from a `.gitignore` file).

**4** 如果模式中不包含斜线字符 `/` ，[Git][] 将其作为环境路径模式处理，并以 `.gitignore` 文件所在目录为基准进行匹配（如果该模式并非定义在 `.gitignore` 文件中，则以版本库的根目录为基准）。

> * Otherwise, [Git][] treats the pattern as a shell glob suitable for consumption by [fnmatch(3)](http://linux.die.net/man/3/fnmatch) with the *FNM_PATHNAME* flag: wildcards in the pattern will not match a `/` in the pathname. For example, `Documentation/*.html` matches `Documentation/git.html` but not `Documentation/ppc/ppc.html` or `tools/perf/Documentation/perf.html`.

**5** 否则，[Git][] 换将模式做为特定的系统路径模式处理：模式中的适配符并不匹配路径中的 `/` 字符。例如， `Documentation/*.html` 会匹配 `Documentation/git.html` ，但并不匹配 `Documentation/ppc/ppc.html` 和 `tools/perf/Documentation/perf.html` 。

> * A leading slash matches the beginning of the pathname. For example, `/*.c` matches `cat-file.c` but not `mozilla-sha1/sha1.c`.

**6** 行首为 `/` 的模式会从文件路径的首部开始匹配。例如， `/*.c` 会匹配 `cat-file.c` ，但并不匹配 `mozilla-sha1/sha1.c` 。

> * A leading `**` followed by a slash means match in all directories. For example, `**/foo` matches file or directory `foo` anywhere, the same as pattern `foo`. `**/foo/bar` matches file or directory `bar` anywhere that is directly under directory `foo`.

**7** 行首为 `**/` 的模式会匹配所有目录。例如， `**/foo` 会匹配所有的名为 `foo` 的文件和目录，这与 `foo` 模式地处理结果是一致的。 `**/foo/bar` 会比如所有父目录为 `foo` 的名为 `bar` 的文件和目录。

> * A trailing `/` matches everything inside. For example, `abc/` matches all files inside directory `abc`, relative to the location of the `.gitignore` file, with infinite depth.

**8** 以 `/` 结尾的模式匹配某个目录内的所有文件和子目录。例如， `abc/` 匹配 `.gitignore` 文件所在目录的 `abc` 子目录中的所有文件，而且不限深度。（*囧！这和前面的模式 **3** 有甚区别？！*）

> * A slash followed by two consecutive asterisks then a slash matches zero or more directories. For example, `a/**/b` matches `a/b`, `a/x/b`, `a/x/y/b` and so on.

**9** 包含 `/**/` 的模式会将 `**` 展开为任意深度的目录。例如， `a/**/b` 可以匹配 `a/b` 、 `a/x/b` 、 `a/x/y/b` 和其它相似的目录。

> * Other consecutive asterisks are considered invalid.

**a** 其它情况下，包含 `**` 的模式会被作为无效模式处理。
