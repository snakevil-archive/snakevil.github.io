---
layout: post
title: "博客页面重构告一段落"
date: 2013-04-14 16:56:43+08:00
tags: ["life-trace", "github-pages"]
---

经过周末两天的奋战，终于把页面和样式都重构了。自我感觉还不错。本来想着来做标题党《博客页面重构完成》，字都打完又删了，感觉还是任重而道远哇。 [陈江](http://yccj.in) 同学说：「比之前那个版本是好多了，但为啥在 iPad 上看样式布局都是凌乱地？」好吧…下周有功夫，再来做移动版本的样式。

![First Page View of the New Style](/s/a/b/new-style-generated-in-20130414-first-page-view.png)

<!--more-->

这次重构其实是以页面为主，样式只是顺路地事情。因为之前初版时比较仓促，对 [Jekyll][] 又完全不熟悉，完全都是猜着做页面。导致有很多莫名其妙的细节问题难以处理，要稍微做点变更都觉得很困难。

也想过是否直接就上 [Octopress][] 算了，毕竟这个项目就是解决我这样的半吊子所碰到的问题。重复造轮子，永远都是大问题…不过踌躇片刻之后，还是放弃了这个念头。一来学习成本进一步提高，而且自一两年前我头次接触 [Octopress][]  开始到现在，它的文档还是充满了程序员风格——晦涩难懂、残缺不全。二者可以练手保持前端技术别完全丢了，这一通下来，我对 [HTML5][] 和 [CSS3][] 是真真切切地捡回了不少，真诚感谢 [MDN][] ！还有就是对于这种谈不上项目的项目而言，造不造轮子，并不算多大的事情…

按照对 [Jekyll][] 更深入地理解，重新拆分整理了页面布局和片段，以及做了少量的标签结构调整。单看文件目录结构，基本上就面目全非了。

     .gitmodules                                  | 10 +++++++---
     _config.yml                                  | 29 ++++++++++++++++++++---------
     _includes/footer.html                        | 24 ------------------------
     _includes/header.html                        | 54 ------------------------------------------------------
     _includes/leftbar.html                       |  2 --
     _includes/main-post.content-abbreviated.html |  5 +++++
     _includes/main-post.content-brief.html       |  3 +++
     _includes/main-post.content-complete.html    | 25 +++++++++++++++++++++++++
     _includes/main-post.html                     | 10 ++++++++++
     _includes/meta-description.html              |  1 +
     _includes/meta-keywords.html                 |  1 +
     _includes/meta-title.html                    |  1 +
     _includes/plugins/disqus-thread.html         | 28 ++++++++++++++--------------
     _includes/plugins/google-webmaster.html      |  1 -
     _includes/plugins/tags-cloud.html            |  9 ---------
     _includes/plugins/twitter-timeline.html      |  4 ++++
     _includes/rightbar.html                      |  2 --
     _includes/sidebar.html                       |  2 ++
     _layouts/archive.html                        | 24 ++----------------------
     _layouts/month.html                          | 15 +++++++++++++++
     _layouts/page.html                           | 74 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++-
     _layouts/post.html                           | 51 +++++++++++++++------------------------------------
     _layouts/tag.html                            | 15 +++++++++++++++
     _layouts/year.html                           | 12 ++++++++++++
     _posts                                       |  2 +-
     _utils/image-archive.sh                      |  4 ++--
     archive.html                                 | 12 +++++++++++-
     atom.xml                                     | 18 ++++++++++--------
     index.html                                   | 33 +++++++++------------------------
     month                                        |  1 +
     robots.txt                                   |  7 +++++++
     s                                            |  2 +-
     sitemap.xml                                  | 34 ++++++++++++++++++++++++++++++++--
     tag                                          |  2 +-
     tags.html                                    | 23 +++++++++++++++++++++++
     35 files changed, 323 insertions(+), 217 deletions(-)

最后来一张『全身风景照』：

![Thumbnail of Index Page of the New Style](/s/a/e/new-style-generated-in-20130414-complete-index-page.png)

[Jekyll]: https://github.com/mojombo/jekyll
[Octopress]: http://octopress.org
[HTML5]: http://www.w3.org/TR/html5/
[CSS3]: http://www.w3.org/Style/CSS/
[MDN]: https://developer.mozilla.org
