---
layout: post
title: 'Jekyll Maruku 对处理层叠列表有 BUG'
date: 2013-04-13 10:16:44+08:00
tags: ['jekyll', 'maruku', 'kramdown', 'markdown']
excerpt: Jekyll 所使用的 Maruku 是一个很赞的 Markdown 解释器，带有语法检查功能。当 Markdown 语法上存在歧义或错误时，能够及时的指出问题所在。我在重构页面时也为此而放弃了 Redcarpet 。然而让我没想到地是， Maruku 处理层叠列表居然会有如此弱智的 BUG ！只好再转投 Kramdown 的怀抱了。
---

导致我发现问题的是之前辛苦很久才翻译出来的《[【译】模拟（对象）不是存根（对象）]({% post_url 2013-04-09-mocks-arent-stubs %})》一文。文中有这样一段 TOC ：

    * [常规测试](#regular-tests)
    * [使用模拟对象进行测试](#tests-with-mock-objects)
        * [使用 EasyMock](#using-easymock)
    * [模拟（对象）与存根（对象）的区别](#difference-between-mocks-and-stubs)
    * [古典测试和模拟主义的测试](#classical-and-mockist-testing)
    * [根据差异选择](#choosing-between-differences)
        * [驾驭 TDD](#driving-tdd)
        * [场地搭建](#fixture-setup)
        * [测试隔离](#test-isolation)
        * [结合测试来实现（功能）](#coupling-tests-to-implementations)
        * [设计风格](#design-style)
    * [做古典主义者还是模拟主义者？](#so-should-i-be-classicist-or-mockist)
    * [最后的想法](#final-thoughts)

使用 [Maruku][] 作为 [Markdown][] 语法解释器时，处理结果截图如下：

![Maruku process result](/s/a/e/maruku-bug-of-markdownify-nesting-lists-in-jekyll.png)

[Maruku]: https://rubygems.org/gems/maruku
[Markdown]: http://daringfireball.net/projects/markdown/

<!--{{ site.title }}-->

改用 [Kramdown][] 后，处理结果就正常了。除在 `_config.xml` 指定了 [Markdown][] 解释器，绝对无其它任何变动！

{% highlight diff linenos=table %}
diff --git a/_config.yml b/_config.yml
index 1f4ae9dc..9bcb5a11 100644
--- a/_config.yml
+++ b/_config.yml
@@ -5,6 +5,7 @@ exclude:
   - README.md
 url: "https://szen.in"
 baseurl: /
+markdown: kramdown
 pygments: true
 lsi: false
 permalink: /:year/:month/:title.html
{% endhighlight %}

本地安装的 [RubyGems][] 版本如下：

    $ gem list

    *** LOCAL GEMS ***

    classifier (1.3.3)
    directory_watcher (1.5.1)
    fast-stemmer (1.0.2)
    jekyll (0.12.1)
    kramdown (1.0.1, 0.14.2)
    liquid (2.5.0)
    maruku (0.6.1)
    posix-spawn (0.3.6)
    pygments.rb (0.4.2, 0.3.7)
    rdiscount (2.0.7.2)
    redcarpet (2.2.2)
    rubygems-update (2.0.3)
    syntax (1.0.0)
    yajl-ruby (1.1.0)

[Kramdown]: https://rubygems.org/gems/kramdown
[RubyGems]: https://rubygems.org
