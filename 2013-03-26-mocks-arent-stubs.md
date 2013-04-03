---
layout: post
title: "【译】Mocks 并非 Stubs"
date: 2013-03-25 23:03:00
tags: ["translation", "xunit"]
excerpt: 『Mock 对象』一词，因其在测试中被广泛用于描述一种特殊的、模仿真实对象的测试用对象，而越发流行。现如今绝大多数的语言，都有了可轻易创建 Mock 对象的框架。Mock 对象虽并非真实地实现，但其也是多种测试用对象之一，使另一种与众不同的测试风格变为可能。在此文中，我将解释 Mock 对象是如何工作地，它是如何鼓励大家实现基于行为验证（Behavior Verification）的测试，以及其爱好者社区是如何实践这一风格迥然的测试方法。
published: false
---

## 译者注

原文《[Mocks Aren't Stubs](http://martinfowler.com/articles/mocksArentStubs.html)》由作者 [Martin Fowler](http://martinfowler.com/) 发表并修撰于其个人博客。

网络上也曾有同学尝试翻译过此文，不过行未至半就太监掉了。

为便于自己深入学习，也为更多感兴趣地同学创造一个初读的机会，重译此文。

**尊重劳动，谢绝转载！**

## TOC

* [常规测试](#regular-tests)
* [使用 Mock 对象测试](#tests-with-mock-objects)
	* [使用 EasyMock 框架](#using-easymock)
* [Mock 与 Stub 之间的差异](#difference-between-mocks-and-stubs)
* [『古典测试』与『极端 Mock 化测试』](#classical-and-mockist-testing)[^1]
* [根据差异选择方法](choosing-between-differences)
	* [驾驭 TDD](driving-tdd)
	* [搭建环境](fixture-setup)
	* [隔离测试](test-isolation)
	* [基于测试实现](coupling-tests-to-implementations)
	* [设计风格](design-style)
* [『古典测试』与『极端 Mock 化测试』如何二选一](so-should-i-be-classist-or-mockist)
* [最后的思考](final-thoughts)

## 引言

我第一次接触到『Mock 对象』这一术语，是在若干年前的极限编程社区里。自那以后，我和这一术语打交道的次数越来越多。一方面是因为许多推崇它的研发带头人是我在 ThoughtWorks 的同事。另一方面，则是我能从广受极限编程思想所辐射的测试文化中，一次又一次的看到这些词汇。

但大多数时候，人们都难以很好地形容究竟什么是 Mock 对象。而尤为突出地是，人们经常会将其与 Stubs 搞混——而后者是一种在测试环境中很常见的手段。我可以理解这种混淆——因为在很长一段实践内，我也如此在理解——但最终，通过与亲身使用过 Mock 对象的开发者大量交流，我对 Mock 有了较为深刻地理解。

其中的差异主要体现在两点。其一是如何去验证测试地结果，区别在于是做状态验证（*State Verification*），还是做行为验证（*Behavior Verification*）。其二是一种完全整合了从测试到设计实现[^2]两个方面的迥然的哲学观，也就是我在本文中所定义的『古典测试』和『极端 Mock 化测试』这两种 TDD 风格。

（在本文的早期版本中，我也意识到此中的差异，但却把这两点混为一谈。因此在我加深理解后，又回来尝试更新本文。如果你并未阅读过早期版本，那么你大概不必理会其中所蕴含的关于我成长的痛苦，因为我是完全摒弃了早期版本重头开始地。但如果你曾多次读过本文的早期版本，请注意我将原有的基于状态测试（*State Based Testing*）和基于交互测试（*Interaction Based Testing*）的划分方法，调整为了状态（*State Verification*）和行为（*Behavior Verification*）的验证方式划分，及『古典测试』与『极端 Mock 化测试』的 TDD 风格划分——了解这些划分原则与方法地调整，可以帮助你更好地阅读本文。除此之外，我同样基于 Gerard Meszaro 的 《[xUnit Patterns](http://www.amazon.cn/mn/detailApp?asin=b001p81jpq)》一书，对用语进行了调整。）

## <a name="regular-tests"></a>常规测试

我们从通过一个简单的示例以阐述这两种风格开始。（示例使用 Java 实现，但其中的原理对于所有面向对象的语言而言，都是共通地。）我们希望能实现一个订单（*order*）对象，并通过另一个仓库（*warehouse*）对象来填充（*fill*）订单。订单对象非常简单，只有一种产品和对应的数量。而仓库对象则库存着不同种类的商品。当我们要求一份订单从仓库填充时，只会出现两种可能的结果。如果仓库中该商品存货足够，那么在订单填充成功地同时，该商品在仓库中的库存量也作相应地减少。当仓库中该商品的存货不足时，订单既不会被填充，库存量也不会发生什么变化。

这两种行为分别意味着与之配套的测试，很传统的 JUnit 测试。

	public class OrderStateTester extends TestCase {
		private static String TALISKER = "Talisker";
		private static String HIGHLAND_PARK = "Highland Park";
		private Warehouse warehouse = new WarehouseImpl();

		protected void setUp() throws Exception {
			warehouse.add(TALISKER, 50);
			warehouse.add(HIGHLAND_PARK, 25);
		}
		public void testOrderIsFilledIfEnoughInWarehouse() {
			Order order = new Order(TALISKER, 50);
			order.fill(warehouse);
			assertTrue(order.isFilled());
			assertEquals(0, warehouse.getInventory(TALISKER));
		}
		public void testOrderDoesNotRemoveIfNotEnough() {
			Order order = new Order(TALISKER, 51);
			order.fill(warehouse);
			assertFalse(order.isFilled());
			assertEquals(50, warehouse.getInventory(TALISKER));
		}

xUnit 的测试遵循着一种四步成套的定式：搭建（*setup*）、执行（*exercise*）、验证（*verify*）和拆卸（*teardown*）。在这个案例中，搭建步骤部分由 `setUp` 方法完成（搭建仓库），而另一部分则在测试方法中（搭建订单）。执行步骤完成了对 `order.fill()` 方法地调用，也是我们希望测试地、与被测对象相关的业务逻辑规则。然后是通过断言语句实践地验证步骤，检查执行步骤中被调用的方法是否如期完成了自己的任务。但此示例中并没有实践拆卸步骤，因为垃圾回收机制已经悄悄完成了这一工作。

在搭建步骤中，我们实例化了两种对象，其中之一就是我们测试的目标，订单对象。但为了能让 `Order.fill()` 方法正常工作，我们就不得不实例化了另一仓库对象。需要强调地是，订单对象才是我们测试的聚焦点。诸多以面向测试方式思考的研发人员喜欢将其命名为受测对象（*object-under-test*）或受测系统（*system-under-test*）。这听起来都很别扭，但却被大家所广泛接受，因此在本文中我也同样如此命名。参鉴 Meszaros 的用语之后，我的最终选择是 SUT （即 *System Under Test*）。

如此说来，在这个测试中我们需要 SUT （订单对象）和其合作者（*collaborator*）（仓库对象）。引入仓库对象有两个理由：一是待测行为必须能正常工作（`Order.fill()`方法会使用到仓库对象的其他方法）；二是我需要它来完成验证工作（`Order.fill()`方法的执行结果，是可能改变仓库对象的状态地）。在下文中，你会发现大量的 SUT 和其合作者之间的区别。（在本文的早期版本中，我使用了『主对象』（*primary object*）来称呼 SUT，『从对象』（*secondary objects*）来称呼其合作者。）

这种测试风格属于 **状态验证**，即：我们通过检查 SUT 和其合作者的状态变更来判断被执行的方法是否如预期般工作。接下来，我们将看到 Mock 对象是如何实践另一种不同的验证方法地。

## <a name="tests-with-mock-objects"></a>使用 Mock 对象测试

现在我会使用 Mock 对象以完成对同样的行为地测试。我选择了使用 jMock 作为 Mock 对象库以实现测试代码。因为相比其它的 Mock 对象库，jMock 拥有最为明显的优势——由这一方法的发起人开发，并及时更新——便于学习，亦便于理解。

	public class OrderInteractionTester extends MockObjectTestCase {
		private static String TALISKER = "Talisker";

		public void testFillingRemovesInventoryIfInStock() {
			//setup - data
			Order order = new Order(TALISKER, 50);
			Mock warehouseMock = new Mock(Warehouse.class);

			//setup - expectations
			warehouseMock.expects(once()).method("hasInventory")
				.with(eq(TALISKER),eq(50))
				.will(returnValue(true));
			warehouseMock.expects(once()).method("remove")
				.with(eq(TALISKER), eq(50))
				.after("hasInventory");

			//exercise
			order.fill((Warehouse) warehouseMock.proxy());

			//verify
			warehouseMock.verify();
			assertTrue(order.isFilled());
		}

		public void testFillingDoesNotRemoveIfNotEnoughInStock() {
			Order order = new Order(TALISKER, 51);
			Mock warehouse = mock(Warehouse.class);

			warehouse.expects(once()).method("hasInventory")
				.withAnyArguments()
				.will(returnValue(false));

			order.fill((Warehouse) warehouse.proxy());

			assertFalse(order.isFilled());
		}

Concentrate on testFillingRemovesInventoryIfInStock first, as I've taken a couple of shortcuts with the later test.

从一开始，搭建步骤就变得大有不同。首先，它被拆分成了数据和期望值（*expectations*）两个部分。数据部分和传统的搭建步骤很类似，构建了我们需要测试的对象。但差别在于我们所创建的对象，SUT 仍然是订单对象，而其合作者却从仓库对象变更为 Mock 仓库对象——亦即 `Mock` 类的一个实例。

搭建步骤的第二部分，则是在 Mock 对象上添加了期待值。这些期待值用以约束当 SUT 被执行时，Mock 对象的哪些方法应该被调用。

当所有的期待值都添加完成后，我就执行了 SUT 订单对象。再然后，是验证步骤，它同样涵盖两个方面。一来我依旧针对 SUT 进行断言。但二来我同样也检验了 Mock 对象——检查它们是否如预期般被调用。

其中的关键区别，就在于我们究竟如何验证订单对象是否与仓库对象正常交互，进而正常工作。之前在状态验证的方式中，我们是针对仓库对象的状态进行断言。而 Mock 使用行为验证方式，因此我们改为检查订单对象是否与仓库对象完成了正确地调用——我们告诉 Mock 对象

[^1]: 『极端 Mock 化』一词的原文用词是 *Mockist* 。这是一个自造词，词根 *-ist* 通俗被理解为 *某某主义* ，较另一词根 *-ish* 即 *某某化* 浓烈程度更高。为了可读性，才如此翻译。
