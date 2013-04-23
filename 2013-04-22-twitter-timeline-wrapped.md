---
layout: post
title: "优化 Twitter 时间线"
date: 2013-04-22 23:35:17+08:00
tags:
  - blog-trace
  - twitter
  - "web-services-of-life"
keywords:
  - 推特
  - timeline
  - 时间线
  - widget
  - 饰件
  - optimization
  - 优化
---

实在无法再忍受原本的 [Twitter 时间线饰件][twitter-timeline-widget] 了——墙、慢、难看…除了那一堆我完全不需要的功能，简直一无是处。于是写了套简单的 [PHP][] + [Javascript][] 的程序对其优化。现在就看着顺眼多了！

![New Widget View of Twitter Timeline](/s/a/a/twitter-timeline-wrapped.png)

[twitter-timeline-widget]: https://twitter.com/settings/widgets
[PHP]: http://php.net
[Javascript]: https://developer.mozilla.org/en-US/docs/JavaScript

<!--more-->

## [twitter-timeline.php](https://gist.github.com/snakevil/5443511#file-twitter-timeline-php-L21) ##

用于处理、优化并转换 [Twitter](https://twitter.com) 时间线饰件的数据。

此程序部署在我的 [VPS](https://szen.in) 上，并支持跨域调用 :) 其 URL 格式为：

> `https://szen.in/twtl/` + 你的 [Twitter 时间线饰件][twitter-timeline-widget] ID + `.json`

## [plugin-twitter-timeline.js](https://github.com/snakevil/snakevil.github.io/blob/static/j/plugin-twitter-timeline.js#L12) ##

完成异步读取、拼装及渲染。

不过因为练手的缘故，也图个简单，没有使用当下流行的种种 [Javascript][] 框架，直接裸写而成。有需要 _HACK_ 的同学就只能见谅了。
