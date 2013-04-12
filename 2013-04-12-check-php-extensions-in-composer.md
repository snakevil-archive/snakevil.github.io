---
layout: post
title: 使用 Composer 检查 PHP 扩展的依赖关系
date: 2013-04-12 21:20:06+08:00
tags: ["php", "composer", "tox"]
excerpt: 家里新配了一个 Tox 的开发环境。动手之前先跑一遍 Ant 检查环境是否能够正常工作。结果 PHPUnit 就报错了——提示 PHP 环境中缺少 PDO::MYSQL_ATTR_USE_BUFFERED_QUERY 常量。果然还是差了 php-pdo-mysql 扩展没有安装。为了以后避免重复出现这么丑陋地问题，因此就想通过 Composer 来检查 PHP 扩展的依赖关系。
---

```
-composer-install:
     [echo] 'composer' used
     [exec] Loading composer repositories with package information
     [exec] Updating dependencies (including require-dev)
     [exec]   - Removing mikey179/vfsstream (v1.1.0)
     [exec]   - Installing mikey179/vfsstream (v1.2.0)
     [exec]     Downloading: 100%
     [exec]
     [exec]   - Removing squizlabs/php_codesniffer (1.4.4)
     [exec]   - Installing squizlabs/php_codesniffer (1.4.5)
     [exec]     Downloading: 100%
     [exec]
     [exec]   - Removing symfony/yaml (v2.2.0)
     [exec]   - Installing symfony/yaml (v2.2.1)
     [exec]     Downloading: 100%
     [exec]
     [exec]   - Installing psr/log (1.0.0)
     [exec]     Downloading: 100%
     [exec]
     [exec]   - Installing pdepend/pdepend (1.1.0)
     [exec]     Downloading: 100%
     [exec]
     [exec]   - Installing phpmd/phpmd (1.4.1)
     [exec]     Downloading: 100%
     [exec]
     [exec] Writing lock file
     [exec] Generating autoload files

unit:
     [echo] '/Users/Snakevil/Documents/Projects/tox.git/bin/phpunit' used
     [exec] PHP Fatal error:  Undefined class constant 'PDO::MYSQL_ATTR_USE_BUFFERED_QUERY' in /Users/Snakevil/Documents/Projects/tox.git/include/phpunit/phpunit/PHPUnit/Framework/TestSuite.php on line 551
     [exec] PHP Stack trace:
     [exec] PHP   1. {main}() /Users/Snakevil/Documents/Projects/tox.git/include/phpunit/phpunit/composer/bin/phpunit:0
     [exec] PHP   2. PHPUnit_TextUI_Command::main($exit = *uninitialized*) /U
     [exec] Fatal error: Undefined class constant 'PDO::MYSQL_ATTR_USE_BUFFERED_QUERY' in /Users/Snakevil/Documents/Projects/tox.git/includsers/Snakevil/Documents/Projects/tox.git/include/phpunit/phpunit/composer/bin/phpunit:62
     [exec] PHP   3. PHPUnit_TextUI_Command->run($ae/phpunit/phpunit/PHPUnit/Framework/TestSuite.php on line 551
     [exec]
     [exec] Call Stack:
     [exec]     0.0004     237512   1. {main}() /Users/Snakevil/Drgv = array (0 => '/Users/Snakevil/Documents/Projects/tox.git/bin/phpunit', 1 => '-c', 2 => '/Users/Snakevil/Documents/Projects/tox.git/etc/phpunit.xml'), $exit = TRUE) /Users/Snakevil/Documents/Projects/tox.git/include/phpunit/phpunit/PHPUnit/TextUI/Command.php:129
     [exec] PHP   4. PHPUnit_TextUI_Command->handleArguments($argv = array (0 => '/Users/Snakevil/Documents/Projects/tox.git/bin/phpunit', 1 => '-c', 2 => '/Users/Snakevil/Documents/Projects/tox.git/etc/phpunit.xml')) /Users/Snakevil/Documents/Projects/tox.git/include/phpunit/phpunit/PHPUnit/TextUI/Command.php:138
     [exec] PHP   5. PHPUnit_Util_Configuration->getTestSuiteConfiguration() /Users/Snakevil/Documents/Projects/tox.git/include/phpunit/phpunit/PHPUnit/TextUI/Command.php:657
     [exec] PHP   6. PHPUnit_Util_Configuration->getTestSuite() /Users/Snakevil/Documents/Projects/tox.git/include/phpunit/phpunit/PHPUnit/Util/Configuration.php:784
     [exec] PHP   7. PHPUnit_Framework_TestSuite->addTestFiles() /Users/Snakevil/Documents/Projects/tox.git/include/phpunit/phpunit/PHPUnit/Util/Configuration.php:860
     [exec] PHP   8. PHPUnit_Framework_TestSuite->addTestFile() /Users/Snakevil/Documents/Projects/tox.git/include/phpunit/phpunit/PHPUnit/Framework/TestSuite.php:416
     [exec] PHP   9. PHPUnit_Framework_TestSuite->addTestSuite() /Users/Snakevil/Documents/Projects/tox.git/include/phpunit/phpunit/PHPUnit/Framework/TestSuite.php:389
     [exec] PHP  10. PHPUnit_Framework_TestSuite->__construct() /Users/Snakevil/Documents/Projects/tox.git/include/phpunit/phpunit/PHPUnit/Framework/TestSuite.php:315
     [exec] PHP  11. PHPUnit_Framework_TestSuite->addTestMethod() /Users/Snakevil/Documents/Projects/tox.git/include/phpunit/phpunit/PHPUnit/Framework/TestSuite.php:212
     [exec] PHP  12. PHPUnit_Framework_TestSuite::createTest() /Users/Snakevil/Documents/Projects/tox.git/include/phpunit/phpunit/PHPUnit/Framework/TestSuite.php:834
```

以上是出现问题的 [Ant][] 执行报告的片段。

[Ant]: http://ant.apache.org

<!--{{ site.title }}-->

去 [Composer][] 官网翻文档，并没有找到关于这一点的明确说明。关门放狗，就找到了 [GitHub][] 中 [Composer][] 官方版本库的这个提案《[#383 Support for pecl dependencies](https://github.com/composer/composer/issues/383#issuecomment-4310430)》。作者在回复中明确说明了：

> **可以使用 `ext-foo` 这样的形式来检查 `foo` 扩展是否已安装，只是 [Composer][] 并不会尝试自动安装缺失的扩展。**

依此对 [`composer.json`](https://github.com/php-tox/tox/blob/master/composer.json) 进行修改。截取 `require` 及 `require-dev` 片段如下：

```json
  "require": {
    "php": ">=5.3.0",
    "psr/log": "1.*@stable"
  },
  "require-dev": {
    "ext-memcached": "*",
    "ext-pdo_mysql": "*",
    "ext-xdebug": ">=2.1",
    "mikey179/vfsStream": "1.*@stable",
    "phpunit/phpunit": "3.*@stable",
    "squizlabs/php_codesniffer": "1.*@stable",
    "phpmd/phpmd": "1.*@stable"
  },
```

因为我的工作环境都是 Mac OS X，使用地是 [MacPorts][] 管理系统包依赖关系。因此在 [Composer][] 中只需要验证是否安装即可，没有对 [PHP][] 扩展有版本硬性要求。

再跑 [Ant][] ，就不会再由 [PHPUnit][] 直接报崩溃性的错误了。

```
-composer-install:
     [echo] 'composer' used
     [exec] Loading composer repositories with package information
     [exec] Updating dependencies (including require-dev)
     [exec] Your requirements could not be resolved to an installable set of packages.
     [exec]
     [exec]   Problem 1
     [exec]     - The requested PHP extension ext-pdo_mysql * is missing from your system.
     [exec]

BUILD FAILED
```

嗯嗯！这下子，看着可就顺眼多了。

[Composer]: http://getcomposer.org
[GitHub]: https://github.com
[MacPorts]: http://www.macports.org
[PHP]: http://php.net
[PHPUnit]: http://www.phpunit.de
