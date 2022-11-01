# WebGL 坐标系统

## 前言📚

原本想打算直接介绍GLSL基础语法或者三维图形相关的内容，可是后来我想了想，不管是在WebGL系统还是在OpenGL系统中都有一个很重要的概念——坐标系统🤔在之前的文章中也提到过几个坐标系统，例如：纹理坐标系统、WebGL坐标系统等，可是这些都是相对笼统的概念，当所有物体进入到WebGL系统后都会遵循这些坐标系的标准📐

但是当进入到三维世界后，我们会面对更复杂的图形图像空间、更复杂的图形变化（但都离不开最基础的平移/旋转/缩放）以及更复杂的图形数据🪐而在图形的显示过程中还会涉及通过 **变换矩阵** 将坐标从一个坐标系统变换到另一个坐标系统的过程🚀

![silly](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-coordinate/silly.jpeg)

## 坐标系统📦

不同的坐标系统也被称作相应的 **空间**，首先来看一下，顶点在最终被转化为片元之前需要经历哪些坐标系统（空间）：

* 局部空间（Local Space）/ 物体空间（Object Space）
* 世界空间（World Space）
* 观察空间（View Space）/ 视觉空间（Eye Space）
* 裁剪空间（Clip Space）
* 屏幕空间（Screen Space）

> 顶点坐标（位于局部空间），称为局部坐标，然后顶点坐标会从局部空间按照上述顺序一步步变换到屏幕空间💻

而坐标从一个空间到另一个空间则需要变换矩阵来完成这一过程：

* 模型矩阵（Model Matrix）
* 观察矩阵（View Matrix）
* 投影矩阵（Projection Matrix）

变换过程就如下图所示：

![space-transform](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-coordinate/space-transform.png)

**❗️本部分是基于OpenGL介绍的❗️**

### 局部空间🏡

**局部空间** 是指物体所在的坐标空间，即对象最开始所在的地方。在局部空间中，物体位于空间的原点，所有的调整都是基于物体的相对位置进行的。举个栗子：相信大家小时候都组装过四驱车，当我们组装四驱车的时候不需要关心我的零部件的经纬度，只需要关心，我这个马达应该安装在这个组件的哪个地方即可🌰

### 世界空间🌎

**世界空间** 是指虚拟的场景所在的空间，比如游戏场景等。它指顶点相对于场景的坐标，当所有物体导入程序时，它们有可能会都挤在世界的原点 *(0.0, 0.0, 0.0)* 上，我们需要为每一个物体定义一个位置，从而能在更大的场景中合理的摆放让它们。模型矩阵的作用就是通过对物体进行位移、缩放、旋转等操作将其摆放到场景中的不同位置。

### 观察空间👀

我们通过WebGL在屏幕上展现给用户的内容并不是世界空间中摆放的全部内容，而是通过摄像机来模拟用户的眼睛所呈现的场景。**观察空间** 就是从摄像机的视角所观察到的空间，也会称作摄像机空间或视觉空间。

以摄像机位置为原点，观察方向为 *-z* 轴方向的一个空间通常用一系列的平移和旋转变换把世界空间中的物体转换到观察空间中。

### 裁剪空间✂️

摄像机有朝向，也有拍摄的视野范围，所有在视野范围之外的东西都是看不到的，都要被剔除。在每个顶点着色器运行结束的时候，OpenGL希望坐标都在一个指定范围内，超出范围的坐标都会被裁剪掉，剩下的坐标才会进入片元着色阶段，这也就是 **裁剪空间** 名字的由来。而 **投影矩阵** 就是将物体从观察空间转换到裁剪空间。

研究表明人两眼重合视域通常为124度，当集中注意力时约为五分之一，即25度（知道为什么当一个人全神贯注时可能会忽略周边发生的事情了吧🤷🏼），单眼的舒适视域为60度。当然，在OpenGL中摄像机的左右、上下方向也都有一定的范围，这个范围称作 **视野角度（FOV）**。

![fov](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-coordinate/fov.png)

图中蓝色的 *w* 和 *h* 就确定了摄像机上下左右能看到的范围大小；通常设置上下左右视野都是90度，同时设置一个近裁剪面和远裁剪面：比近裁剪面近、比远裁剪面远的物体被剔除，把两个裁剪面之间所有的物体都映射到投影平面上✄

我们再说回到投影矩阵，投影矩阵分为两种：**正射投影矩阵** 和 **透视投影矩阵** *（将特定范围内坐标转化到标准化设备坐标系（NDC）的过程被称之为投影）*。正射投影和透视投影的差别很明显，透视投影看起来更加立体真实（就想学画画时老师教的“近大远小，近高远低”），而正射投影则没有这种效果，使用正射投影的物体没有透视，远处的物体也不会显得更小，在正射投影中每个顶点距离观察者的距离都是一样的，当然正射投影也有它的用处，比如用于渲染一些二维的建筑或工程的程序，在这些场景中工程师们更希望顶点不会被透视所影响。

为上述每一个步骤都创建相应的变换矩阵：模型矩阵、观察矩阵和投影矩阵。一个顶点坐标将会根据以下过程被变换到裁剪坐标：

![clip-view](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-coordinate/clip-view.png)

顶点着色器的输出要求所有的顶点都在裁剪空间内，这就是使用变换矩阵做的，然后OpenGL对裁剪坐标执行透视除法从而将它们变换到标准化设备坐标；OpenGL使用内部参数来标准化设备坐标映射到屏幕坐标，每一个坐标都关联了一个屏幕上的点，这个过程称为视口变换。

> 透视除法是将4D裁剪空间坐标变换为3D标准化设备坐标的过程

### 视口空间🎥

该空间可以简单地理解为应用窗口，投影平面上的东西和窗口上的像素通过一一对应的方式映射到窗口，在窗口上显示。这一步OpenGL会帮我们完成！

以上内容来自于 [LearnOpenGL](https://learnopengl-cn.readthedocs.io/zh/latest/01%20Getting%20started/08%20Coordinate%20Systems/)，感谢大家观看……

![dont-leave](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-coordinate/dont-leave.jpeg)

还有内容呢，前面只是说了WebGL他爹，WebGL还没提呢（狗头保命）WebGL中的模型、视图、投影矩阵可以看这篇MDN文章，内容与OpenGL基本一致，再次就不重复介绍了。

## 回顾⏎

我们了解了上面几个坐标系之后，回想一下我们之前文章的示例中好像就只有局部空间和视口空间，其实当顶点被片元着色器处理之后它就成为了 **标准化设备坐标（NDC）**，也就是说我们之前的示例的流程是下图这样的：

![ndc](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-coordinate/ndc.png)

这也就应对上了之前我们在矩形 *canvas* 中绘制三角形，旋转之后发生形变的场景🧐中间省略了这么多坐标转换的过程，我们是不是可以在各个坐标系统的转换过程中做点文章，解决上述我们的问题呢？答案是 **当然啦！**

![ndc-showcase](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-coordinate/ndc-showcase.png)

就是说我们需要在世界空间坐标系→观察坐标系和观察坐标系→裁剪空间坐标系两个环节做文章，上图中也可以看出其实就是对其进行等比的缩放，使其能按照我们的设想在屏幕上展示😁

有趣的坐标系统介绍到这里啦，后续会出更多好玩并且有用的文章分享给大家，感谢阅读🔚

发表于2020-05-15
