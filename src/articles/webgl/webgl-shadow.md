# WebGL 阴影

## 📖前言

在之前的文章中，讲解了光照系统（平行光、点光源以及环境光）的实现方式。但不知道各位有没有发现加上光照之后，并没有出现与被照射的物体相对应的阴影，这很显然不符合我们自然界的规律🌴本文将为大家讲述一下如何为空间中的物体添加阴影❏

## 🧑‍💻如何实现阴影

实现阴影的基本思想是：太阳看不到阴影🌞

设想你就站在光源处，你就是 Sun！在你的视野范围内，你所能看得到的物体都能被阳光照射到，如果你非得犟你是近视，那咱们得换个地方聊聊了！

![baochui](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-shadow/baochui.png)

你看不到的物体就在阴影中。所以，我们就需要用到光源与物体之间的距离（即物体在光源坐标系下的深度值）来决定物体是否可见。如下图所示，同一条光线上有两个点P1和P2，由于P2的z值大于P1，所以在阴影中：

![shadow-coordinate](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-shadow/shadow-coordinate.png)

我们需要使用两对着色器以实现阴影：（1）一对着色器用来计算光源到物体的距离；（2）另一对着色器根据（1）中计算的距离绘制场景。使用一张纹理图像把（1）的结果传入（2）中，这张纹理图像就被称为 **阴影贴图**，而通过阴影贴图实现阴影的方法就叫做 **阴影映射**。阴影映射主要分两步：

* [1] 悄悄地，你来到了光源处（即将视点移到光源处），带来了（1）号着色器并运行。这时，那些“将要被绘制”的片元都是被光照到的，即落在这个像素上的各个片元中最前面的。我们并不需要实际地绘制出片元的颜色，而是将片元的z值写入到阴影贴图中。
* [2] 轻轻地，你走回了原来的位置，并调皮地运行了（2）号着色器绘制场景。此时，我们计算出每个片元在光源坐标系（即（1）中的视点坐标系）下的坐标，并与阴影贴图中记录的z值比较，如果前者大于后者，就说明当前片元处在阴影中，用较深的颜色绘制。

了解了绘制阴影的两个步骤之后，咱们先不忙写阴影映射的实现，反正写出来你也不懂Image（Doge

![silence](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-shadow/silence.png)

### 帧缓冲区对象和渲染缓冲区对象

回想一下我们之前写过的着色器，着色器处理之后的结果都是直接输出到屏幕上，让用户可见的。但是我们再仔细回头看一下上面步骤（1）中的描述，其中有一句：“我们并不需要实际地绘制出片元的颜色，而是将片元的值写入到阴影贴图中”。**帧缓冲区对象** 和 **渲染缓冲区对象** 就是干这个事儿的！

在默认情况下，WebGL在颜色缓冲区中进行绘制，在开启隐藏面消除功能时，还会用到深度缓冲区。总之，绘制结果是储存在颜色缓冲区中的。

**帧缓冲区对象（Framebuffer Object）** 可以用来代替颜色缓冲区或深度缓冲区，如下图。绘制在帧缓冲区中的对象并不会直接显示在 *<canvas>* 上，我们可以先对帧缓冲区中的内容进行一些处理再显示，或者直接用其中的内容作为纹理图像。所以在帧缓冲区中进行绘制的过程又称为 **离屏绘制**。

![framebuffer-object](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-shadow/framebuffer-object.jpeg)

下图显示了帧缓冲区对象的结构，它提供了颜色缓冲区和深度缓冲区的替代品。绘制操作并不是直接发生在帧缓冲区中的，而是发生在帧缓冲区所关联的对象上。一个帧缓冲区有3个关联对象：**颜色关联对象**、**深度关联对象** 和 **模板关联对象**，分别用来替代 *颜色缓冲区*、*深度缓冲区* 和 *模板缓冲区*。

![framebuffer-object-replace](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-shadow/framebuffer-object-replace.jpeg)

经过一些设置，WebGL就可以向帧缓冲区的关联对象中写入数据，就像写入颜色缓冲区或深度缓冲区一样。每个关联对象又可以是两种类型：纹理对象和渲染缓冲区对象。纹理对象在之前的[《WebGL 纹理映射》](https://mp.weixin.qq.com/s?__biz=MzIxMzY1OTQxOQ==&mid=2247483783&idx=1&sn=d5517611d9e288e58d55c53e6d762eeb&scene=21#wechat_redirect)一文中已经介绍了，它储存了纹理图像。当我们把纹理对象作为颜色关联对象关联到帧缓冲区对象后，WebGL就可以在纹理对象中绘图。渲染缓冲区对象表示一种更加通用的绘图区域，可以向其中写入多种类型的数据。

缓冲区对象使用方式会在下面绘制阴影贴图的实例中介绍。

### 绘制阴影

首先实现两对着色器：

```glsl
// SHADOW_VS_SHADER
attribute vec4 a_Position;
uniform mat4 u_FinalMatrix;

void main () {
  gl_Position = u_FinalMatrix * a_Position;
}

// SHADOW_FS_SHADER
#ifdef GL_ES
	precision mediump float;
#endif

void main () {
  gl_FragColor = vec4(gl_FragCoord.z, 0.0, 0.0, 0.0);
}

// VS_SHADER
attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat4 u_FinalMatrix;
uniform mat4 u_FinalMatrixFromLight;
varying vec4 v_PositionFromLight;
varying vec4 v_Color;

void main () {
  gl_Position = u_FinalMatrix * a_Position;
  v_PositionFromLight = u_FinalMatrixFromLight * a_Position;
  v_Color = a_Color;
}

// FS_SHADER
#ifdef GL_ES
	precision mediump float;
#endif
uniform sampler2D u_ShadowMap;
varying vec4 v_PositionFromLight;
varying vec4 v_Color;

void main () {
  vec3 shadowCoord = (v_PositionFromLight.xyz/v_PositionFromLight.w)/2.0 + 0.5;
  vec4 rgbaDepth = texture2D(u_ShadowMap, shadowCoord.xy);
  float depth = rgbaDepth.r;
  float visibility = (shadowCoord.z > depth + 0.005) ? 0.7 : 1.0;
  gl_FragColor = vec4(v_Color.rgb * visibility, v_Color.a);
}
```

*SHADOW_VS_SHADER* 和 *SHADOW_FS_SHADER* 负责生成阴影贴图（为了方便展示我将四个着色器写到了一起，各位在编写着色器时记得要分开写哦）。我们需要将绘制目标切换到帧缓冲对象，把视点在光源处的模型视图投影矩阵传给 *u_FinalMatrix* 变量，并运行着色器。着色器会将每个片元的z值写入帧缓冲区关联的阴影贴图中。顶点着色器的任务很简单，就是将顶点坐标乘以模型视图投影矩阵，而片元着色器相对复杂一些，它将片元的z值写入了纹理贴图中。

*VS_SHADER* 和 *FS_SHADER* 实现了步骤（2），将绘制目标切换回颜色缓冲区，把视点移回原位，开始真正地绘制场景。此时，我们需要比较片元在光源坐标系下的z值和阴影贴图中对应的值来决定当前片元是否处在阴影之中。*u_FinalMatrix* 变量是视点在原处的模型视图投影矩阵，而 *u_FinalMatrixFromLight* 变量是第一步中视点位于光源处时的模型视图投影矩阵。顶点着色器计算每个顶点在光源坐标系中的坐标 *v_PositionFromLight*，并传入片元着色器。我们使用 *rgbaDepth.r* 进行比较是因为，在 *SHADOW_VS_SHADER* 中，我们将深度信息写入了 *gl_FragColor* 的r分量。而剩下大家可能比较疑惑的就是计算 *shadowCoord* 的方式，这个其实很简单：

![shadow-formula](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-shadow/shadow-formula.png)

通过上面简单的转换，就可以得到计算 *shadowCoord* 的公式了🥰但是我们在比较深度信息的时候，还加上了一个0.005的偏移量，如果你删去0.005会发现程序中出现了许多条带，又称 **马赫带**。

> 马赫带效应 是由于人类视觉系统对视网膜捕获的图像的亮度通道执行的空间高增益滤波。马赫（Mach）于1965年报道了这种作用，推测是通过视网膜神经元之间的侧向抑制在视网膜本身中进行过滤。冯·贝塞西（vonBékésy）指出，这种猜想得到了其他（非视觉）感官的观察的支持。视觉模式通常出现在受特定自然照射的曲面上，因此可以将滤波的发生解释为学习的图像统计数据的结果。可以将滤波效果建模为卷积在描述照明的梯形函数和一个或多个带通滤波器之间。通过使用以倍频程间隔缩放的9个偶数对称滤波器的模型，可以获得严格的近似值。
> 效果与边界的方向无关。
> （摘自维基百科）

下面看一下JavaScript代码：

```js
const OFFSCREEN_WIDTH = 2048, OFFSCREEN_HEIGHT = 2048;
const LIGHT_X = 0, LIGHT_Y = 7, LIGHT_Z = 2;

function main () {
  // ...
  
  // 初始化生成阴影贴图的着色器
  const shadowProgram = createProgram(gl, SHADOW_VSHADER_SOURCE, SHADOW_FSHADER_SOURCE);
  // ...
  
  // 初始化正常绘制的着色器
  const normalProgram = createProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  // ...
  
  // 设置顶点信息
  const triangle = initVertexBuffersForTriangle(gl);
  const plane = initVertexBuffersForPlane(gl);
  
  // 初始化帧缓冲区（FBO）
  const fbo = initFramebufferObject(gl);
  
  // 将纹理绑定到纹理单元上
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, fbo.texture);
 // 为阴影贴图准备视图投影矩阵
  const viewProjMatrixFromLight = new Matrix4();
  viewProjMatrixFromLight.setPerspective(70.0, OFFSCREEN_WIDTH/OFFSCREEN_HEIGHT, 1.0, 100.0);
  viewProjMatrixFromLight.lookAt(LIGHT_X, LIGHT_Y, LIGHT_Z, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
  
  // 为正常绘制准备视图投影矩阵
  onst viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(45, canvas.width/canvas.height, 1.0, 100.0);
  viewProjMatrix.lookAt(0.0, 7.0, 9.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

  let currentAngle = 0.0;
  let finalMatrixFromLight_t = new Matrix4(); // 三角形
  let finalMatrixFromLight_p = new Matrix4(); // 平面
  
  const tick = function() {
    currentAngle = animate(currentAngle);

    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.viewport(0, 0, OFFSCREEN_HEIGHT, OFFSCREEN_HEIGHT);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(shadowProgram); // 设置生成阴影贴图的着色器
    // 绘制三角形和平面（阴影贴图）
    drawTriangle(gl, shadowProgram, triangle, currentAngle, viewProjMatrixFromLight);
    finalMatrixFromLight_t.set(g_finalMatrix);
    drawPlane(gl, shadowProgram, plane, viewProjMatrixFromLight);
    finalMatrixFromLight_p.set(g_finalMatrix);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(normalProgram); // 设置普通绘制的着色器
    gl.uniform1i(normalProgram.u_ShadowMap, 0);  // Pass 0 because gl.TEXTURE0 is enabledする
    // 普通绘制三角形和平面
    gl.uniformMatrix4fv(normalProgram.u_FinalMatrixFromLight, false, finalMatrixFromLight_t.elements);
    drawTriangle(gl, normalProgram, triangle, currentAngle, viewProjMatrix);
    gl.uniformMatrix4fv(normalProgram.u_FinalMatrixFromLight, false, finalMatrixFromLight_p.elements);
    drawPlane(gl, normalProgram, plane, viewProjMatrix);

    window.requestAnimationFrame(tick, canvas);
  };
  tick();
}
```

*main()* 函数首先初始化了两个着色器程序，然后初始化三角形和矩形顶点的数据，接着调用 *initFramebufferObject()* 函数创建帧缓冲区对象。再接着，将帧缓冲区的纹理关联对象，即阴影贴图绑定到0号纹理单元，将单元编号传给 *u_ShadowMap* 变量。

接下来，我们建立了视点在光源处的视图投影矩阵，用来生成纹理贴图，关键之外在于需要将光源的位置作为视点的位置传入 *lookAt()* 函数。

下面来看一下生成帧缓冲区对象的代码：

```js
function initFramebufferObject (gl) {
  let framebuffer, texture, depthBuffer;
  // 创建帧缓冲对象
  framebuffer = gl.createFramebuffer();
  
  // 创建并设置纹理参数
  texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  
  // 创建渲染缓冲对象
  depthBuffer = gl.createRenderbuffer();
  
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
 gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
  
 // 将纹理贴图和渲染缓冲对象关联到FBO上
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
  
  // 检查FBO配置状态
 let e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  
  framebuffer.texture = texture; // 存一下纹理信息

  // 解绑缓存对象
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);

  return framebuffer;
}
```

还是很简单的哈，总结一下：

* [1] 创建帧缓冲区对象（*gl.createFramebuffer()*）；
* [2] 创建纹理对象并设置其参数（*gl.createTexture()、gl.bindTexture()、gl.texImage2D()、gl.Parameteri()*）；
* [3] 创建渲染缓冲区对象（*gl.createRenderbuffer()*）；
* [4] 绑定渲染缓冲区对象并设置其尺寸（*gl.bindRenderbuffer()、gl.renderbufferStorage()*）；
* [5] 将帧缓冲区的颜色关联对象指定为一个纹理对象（*gl.framebufferTexture2D*）；
* [6] 将帧缓冲区的深度关联对象指定为一个渲染缓冲区对象（*gl.framebufferRenderbuffer()*）；
* [7] 检查帧缓冲区配置是否正确（*gl.checkFramebufferStatus()*）；
* [8] 在帧缓冲区中进行绘制（*gl.bindFramebuffer*）。

![shadow-result](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-shadow/shadow-result.gif)

怎么样，效果是不是还不错！但是如果我们把光源的位置调高之后，就会发现无法显示阴影贴图了，这是因为分量精度的问题，但是我们可以通过其他分量来储存更多的信息！

## 🎬结束语

![too-hard](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-shadow/too-hard.png)

有趣的阴影贴图就介绍到这里啦，后续会出更多好玩并且有用的文章分享给大家，感谢阅读🔚

发表于2020-06-27
