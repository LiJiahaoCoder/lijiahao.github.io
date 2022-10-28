# WebGL 我是谁？

## ◀️回顾2020

2020 年 是操🥚的一年，疫情肆虐、美股熔断、巨星陨落... 但***的 2020 终于滚🥚了，抛开不快，张开怀抱迎接崭新的 2021🎊

2020年4月 开始正式在公众号发文记录、总结、分享自己的学习内容，8 个月来感谢各位的支持，同时也在网上结识了很多有趣的人。公众号粉丝数量也从 0 到了 190 多个，hhhhh 虽然不多但有人喜欢看已经很满足了 :D 也有些朋友看了之后会给我提出一些意见，我也会继续改进产出更多有趣的文章。

![hhh](https://github.com/LiJiahaoCoder/lijiahao.github.io/blob/master/src/assets/articles/webgl/what-is-webgl/hhh.jpeg)

从 4月 到 11月 陆续发了 WebGL/图形学 相关的文章 *19篇*，技术闲谈  *3篇*，无主题嘚吧嘚 *2篇*，数学类 *1篇*，共计 *25篇* 原创文章，平摊下来也算半个月更一次了吧（狗头保命）。同时也开始了自己的一些初体验，比如 3月 组织翻译开源书籍，7月 达成了自己在 bilibili freeCodeCamp 直播间的第一次直播（表演现场翻车），还在 10月 组织了线上模式的开源大会成都分会场等。

![record](https://github.com/LiJiahaoCoder/lijiahao.github.io/blob/master/src/assets/articles/webgl/what-is-webgl/record.png)

最近回顾之前的文章时发现，过去所分享的所有 WebGL 相关文章好像都是关于其工作原理和图形学相关的知识，但却忽略了 WebGL 本身。在 2021年 的开始，让我们回到最初的起点认识一下 ***WebGL***。

## 🧐我是谁？

很多人问我：“WebGL 是什么？一门新的语言？一个前端框架？”，下面就来正式介绍一下 WebGL 这个神奇的东西。

![who-i-am](https://github.com/LiJiahaoCoder/lijiahao.github.io/blob/master/src/assets/articles/webgl/what-is-webgl/who-i-am.jpeg)

每当看到形如 WebXXX 的名字时，各位就能很容易的猜到此物应与浏览器有关，比如：WebAssembly、WebKit 等，WebGL 亦如此。WebGL 中的 GL 实则是 Graphics Library 的缩写，也就是说 WebGL 其实是适用于浏览器的图形库。其标准定义如下：

> WebGL is a cross-platform, royalty-free web standard for a low-level 3D graphics API based on OpenGL ES, exposed to ECMAScript via the HTML5 Canvas element.
译：WebGL 是一个基于 OpenGL ES 的 3D 图形 API ，它是跨平台的并且免费的，通过 HTML5 的 Canvas 元素提供给 ECMAScript 使用。

上面的内容中又提到了 OpenGL ES 这个东西，它又是谁？它又和我们熟知的 OpenGL 什么关系？让我给你揭开这几个图形协议的身世之谜～

## 🐍女娲氏

相传女娲以泥土仿照自己抟土造人，创造并构建人类社会。而 OpenGL、OpenGL ES、WebGL 这些标准又是由谁提出和制定的呢？这我们就需要引出一个”神秘组织“ —— Khronos Group。

![khronos](https://github.com/LiJiahaoCoder/lijiahao.github.io/blob/master/src/assets/articles/webgl/what-is-webgl/khronos.png)

之所以称其为“女娲氏”是因为 Khronos 创立了很多标准，除了上述的几个为人熟知的图形学协议外，还包括 OpenCL/OpenVX/NNEF 等并行计算和机器学习等标准。同时，Khronos 并不是由某一人或某一公司创建的，而是由各个筹办成员组成的：华为、AMD、Apple、Google、Sony等。看看这些科技行业的巨 饿 鳄就能看出来 Khronos 有多 Dior 了吧！

## 👶繁衍生息

### OpenGL

言归正传，上面所说的年龄最长的就是 OpenGL 了，它在 1992年6月30日 被创立，至今已有28个年头。直到现在，OpenGL 仍是应用最广泛的图形 API，它与网络、系统都无关，能够让开发人员在PC、工作站以及硬件上编写图形应用软件。他应该算是图形学协议的始祖！图形学协议并不是一经制定就不再改变的，发展至今 OpenGL 也已经到了 4.6 版本。

![opengl](https://github.com/LiJiahaoCoder/lijiahao.github.io/blob/master/src/assets/articles/webgl/what-is-webgl/opengl.png)

### OpenGL ES

看到 ES，各位应该很容易想到 嵌入式系统，OpenGL ES 正是用在我们的手机及游戏机等设备上的图形 API。除了系统不一样之外，它和 OpenGL 还有其他区别吗？

答案是 啃腚 肯定的~ 如果我们把 OpenGL 给手机用，这包袱未免也太重了！所以 OpenGL ES 的内容可以理解为是 OpenGL 的阉割版（这未免也太惨了，刚出生就给绝育了），比如移除了多余的多边形，在之前的 WebGL 的文章中我们有说到，所有的复杂多边形都是由基础的三角形组成，这一点 OpenGL ES 也一样，OpenGL ES 中移除了如矩形之类的等复杂多边形，只保留了点、线和三角形这些基础图形。从 2003年7月28日 发展至今，OpenGL ES 也已经发展到了 3.2 版本。

![opengl-es](https://github.com/LiJiahaoCoder/lijiahao.github.io/blob/master/src/assets/articles/webgl/what-is-webgl/opengl-es.png)

### WebGL

最后来说说 WebGL，目前 WebGL 共有 1.X/2.X 两个大版本，而大家所熟知的 ThreeJS 则是默认使用了 WebGL 2.0。如果说 OpenGL ES 是”绝育“后的 OpenGL，那么 WebGL 就应该是 OpenGL ES 的亲生骨肉。如上面所说，OpenGL ES 共有 1.X/2.X/3.X 三个大版本，我将其分为两大阵营：1.X 和 2.X/3.X。至于原因，听我给你道来~

渲染管线 的实现分为两种：固定管线 和 可编程管线。为了方便大家理解，我就以平时买车为例，固定管线提供了一些特定的开关让我们来通过组合配置开关来满足某些场景的也无需求，就类似于我们去4S店买车，我们只能从真皮座椅、轮毂等选项中选择；而可编程管线就类似专业赛车手自己组装赛车，可自定义性贼高。而 OpenGL ES 1.0 就是固定管线，2.0/3.0 则是可编程管线。

WebGL 1.0/2.0 分别是基于 OpenGL ES 2.0/3.0 的，也就是说 WebGL 的渲染管线是可编程管线。可编程管线的可编程之处就是我们 Shader。而 1.0 和 2.0 在使用上并无太大区别，2.0 多了更多功能，比如 Shader 支持更多的函数（如矩阵函数，在 GLSL 中直接获取贴图大小等），支持 3D贴图，支持非2的次方尺寸的图等。同时要注意浏览器对两个版本的兼容性：

![webgl1](https://github.com/LiJiahaoCoder/lijiahao.github.io/blob/master/src/assets/articles/webgl/what-is-webgl/webgl1.png)

![webgl2](https://github.com/LiJiahaoCoder/lijiahao.github.io/blob/master/src/assets/articles/webgl/what-is-webgl/webgl2.png)

![webgl](https://github.com/LiJiahaoCoder/lijiahao.github.io/blob/master/src/assets/articles/webgl/what-is-webgl/webgl.png)

## 🎬后记

其实本文是打算在 2020年12月31日 作为一年的总结发出的，但请年假去西岭雪山玩了两天就滞后在新年的一个工作日来发了（hhhhhhhhhh），一想在新的一年重新认识一下 WebGL 也挺好 ;p

西岭雪山照片奉上：

![xiling-mountain](https://github.com/LiJiahaoCoder/lijiahao.github.io/blob/master/src/assets/articles/webgl/what-is-webgl/xiling-mountain.jpeg)

新的一年祝各位 ***身体健康，发际线逆生长！***

发表于2021-01-04
