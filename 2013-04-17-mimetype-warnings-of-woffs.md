---
layout: post
title: "Woff 字体的 Mime 类型警告"
date: 2013-04-17 11:34:23+08:00
tags:
  - "css"
  - "mimetype"
keywords:
  - "woff"
  - "google-chrome"
---

今天无意间在开启开发者工具的情况下访问了博客，发现 [Google Chrome][] 针对我所使用地每种 [Woff][] 字体都有警告。

![Mimetype Warnings of Woffs in Google Chrome](/s/a/3/mimetype-warnings-of-woffs-1.png)

根据搜到的两篇文章《[Mime type for WOFF fonts? - Stack Overflow](http://stackoverflow.com/questions/3594823/mime-type-for-woff-fonts)》和《[Google Chrome and WOFF font MIME type warnings][]》，修改了我的 [Nginx][] 配置：

{% highlight nginx linenos=table %}
types {
    application/font-woff   woff;
}
{% endhighlight %}

[Google Chrome]: http://www.google.com/chrome/
[Woff]: http://en.wikipedia.org/wiki/Web_Open_Font_Format
[Google Chrome and WOFF font MIME type warnings]: http://zduck.com/2013/google-chrome-and-woff-font-mime-type-warnings/
[Nginx]: http://wiki.nginx.org/Modules

<!--more-->

然而很不幸地是，这种警告在 [Google Chrome][] v26 中依然存在：

![Mimetype not Supported in Google Chrome v26](/s/a/2/mimetype-warnings-of-woffs-2.png)

看来《[Google Chrome and WOFF font MIME type warnings][]》一文中所述地『该问题会很快解决』有点乐观啊 :(

> Unfortunately, Google Chrome (as of 26 beta) still expects you to use `application/x-font-woff` and doesn’t recognize `application/font-woff` as a valid MIME type. This [has been fixed](https://bugs.webkit.org/show_bug.cgi?id=111418) in the WebKit trunk but hasn’t been merged into Chrome yet. The [Chromium bug report](https://code.google.com/p/chromium/issues/detail?id=178823) has been closed so it should be coming soon.
