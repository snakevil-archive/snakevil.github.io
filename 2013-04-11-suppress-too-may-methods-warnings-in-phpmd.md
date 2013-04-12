---
layout: post
title: 在 PHPMD 中抑制『方法过多』的警告
date: 2013-04-11 11:14:08+08:00
tags: ["php", "phpmd", "tox"]
excerpt: 这两天在重构 Tox 中的 Pdo 部分，但一直困扰于 PHPMD 的警告。因为不愿意为了消除警告而无意义地继承拆分，因此小研究了一下 PHPMD 的用法。
---

[PHPMD][] 的 `TooManyMethods` 检查规则，对于大多数情况来说，都可以很方便地发现功能耦合过高的问题。但这需要我们能够较好地把握这样一条线——什么样的方法需要被计数？

再度确认这一功能的目标和意义，是以统计方法的形式，来判断一个类中是否承载了过多地功能。因此，这里的方法，应该是功能方法。

在 [Tox][] 中，为了基于 PHP 的魔法方法 `__get()` 和 `__set()` 来实现可读、可写属性，同时又为了符合 [PSR-2][] 编码规范，采用了 `toxGetProp()` 和 `toxSetProp()` 这样的方法命名格式。而另一方面，为了将组合关系（Composition）中的协作者对象尽可能地解耦，又采用了 `newAssembly()` 这样的方法命名格式。

与此同时，PHP 的一些既定方法的实现，如 `__construct()` 、 `__clone()` 和 `__toString()` 等，我认为也是不应该纳入计数地。

那么问题就是，如何让 [PHPMD][] 了解这样的方法应该被排除呢？

[PHPMD]: http://phpmd.org
[Tox]: https://github.com/php-tox/tox
[PSR-2]: https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-2-coding-style-guide.md

<!--{{ site.title }}-->

查看 [`TooManyMethods` 规则的源代码](https://github.com/phpmd/phpmd/blob/master/src/main/php/PHP/PMD/Rule/Design/TooManyMethods.php#L129)，我找到了一个 [符合需要的属性 `ignorepattern`](https://github.com/phpmd/phpmd/blob/master/src/main/php/PHP/PMD/Rule/Design/TooManyMethods.php#L94) 。

然后阅读 [PHPMD][] 的文档《 [如何为 PHPMD 编写规则](http://phpmd.org/documentation/writing-a-phpmd-rule.html) 》，找到了属性设置的方法。

因此在 [Tox][] 的 [`etc/phpmd.xml`](https://github.com/php-tox/tox/blob/master/etc/phpmd.xml) 中我是这么写地：

{% highlight xml linenos=table %}
  <rule ref="rulesets/codesize.xml/TooManyMethods">
    <properties>
      <property name="ignorepattern"
                value="@^((tox[GS]|[gs])et|new|__).+$@"
                description="Ignores Tox-specific getters/setters, composite factors and PHP internal magic methods."
      />
    </properties>
  </rule>
{% endhighlight %}

重新再跑 [PHPMD][]，数量就从原来的 **18** 降到了 **12** ，效果显著。

但最终目标是要让 [PHPMD][] 绕过这个问题，使 [Ant][] 集成测试可以通过。怎么办？

基于 [PHPMD][] 的另一篇文档《 [抑制 PHPMD 警告](http://phpmd.org/documentation/suppress-warnings.html) 》中提供的方法，我加上了 `@SuppressWarnings(PHPMD.TooManyMethods)` 这样的特殊注释标记。问题终于搞定！

[Ant]: http://ant.apache.org
