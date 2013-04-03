---
layout: post
title: "Nginx 如何处理 URL 中的空格"
date: 2013-03-29 10:45:00
tags: ["nginx"]
published: false
---

最近反复碰到 [Nginx][] 错误处理 URL 中空格的问题，无论是 `%20` 还是 `+` ，都有可能被错误处理导致错误的 [`404`](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.5) 响应。

先了解一下背景：

* 早期的 [HTML][] 规范[^1]约定，基于 `application/x-www-form-urlencoded` 格式的表单数据中的空格，需要 *转换* 为 `+` 号；

* [RFC3986 - Uniform Resource Identifier (URI): Generic Syntax]() 规范约定，URL 中的空格，需要 *转义* 为 `%20`。

（未完，待续…）


[^1]: [The form-urlencoded Media Type *on W3C Hypertext Markup Language - 2.0*](http://www.w3.org/MarkUp/html-spec/html-spec_8.html#SEC8.2.1)

[Nginx]: http://nginx.org
[HTML]: http://www.w3.org/TR/html51/
