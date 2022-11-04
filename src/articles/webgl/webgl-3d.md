# WebGL 进入三维的世界

## 📒前言

终于来到了期待已久的三维世界，在之前的文章中我们给顶点着色器中 *gl_Position* 赋的值都只考虑了x和y坐标。但是当我们进入三维世界需要绘制三维图形之后，我们还需要考虑深度信息。下面就让我们来领略一下三维世界的奥妙！

![aomiao](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/aomiao.png)

## 👀你瞅啥

当进入三维空间之后，就像我们真实的世界一样了。比如我们想在成都春熙路找趴在IFS楼上的大屁股熊猫的话，我们需要确定IFS在哪儿、我应该朝哪个方位看、我站的地方视野够不够宽够不够广，足不足以让我看到熊猫腚。在这个定眼瞧（小岳岳的梗）IFS熊猫屁股的描述中，我们可以确定以下信息：

* [1] 观察者：也就是我们自己；
* [2] 观察目标：IFS的熊猫屁股；
* [3] 可视距离：也就是我能不能看到熊猫屁股。

观察者所处的位置成为视点（也就是你站的地方），从视点出发沿着观察方向的射线称作视线（也就是你锐利的眼神发出的耀眼的光）：

![look-point](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/look-point.jpeg)

为了确定观察者状态，需要获取两个信息：视点，也就是观察者的位置；观察目标点，即被观察目标所在的点。这样我们就可以确定视线了，除此之外我们还需要知道正方向，所谓正方向就是最终绘制在屏幕上的影响中的向上的方向🌰为了方便大家理解给大家举个例子：我们站在一个固定的地方，向远处眺望四姑娘山，这样我们就确定了视点和观察目标，那么正方向的作用是什么呢？试想一下，如果我们倒立看四姑娘山，那么在我们脑中（对应到WebGL就是屏幕）呈现的画面就是倒着的了，但是在倒立的过程中，我们的视点和观察目标是没有改变的（忽略倒立之后头部的位移，将人视作一个点），所看到的画面却发生了改变。所以正方向的作用就是规定我们看的方向：

![look-coordinate](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/look-coordinate.jpeg)

那么我们就可以使用上述三个矢量创建一个 **视图矩阵（View Matrix）**，然后将该矩阵传给顶点着色器。视图矩阵可以表示观察者的状态，包含视点、观察目标点、上方向等信息。之所以成为视图矩阵，是因为它影响了显示在屏幕上的视图，也是就观察者观察到的场景。

在WebGL中，观察者的默认状态应该是：视点位于坐标系统原点 *(0, 0, 0)*，视线为Z轴负方向，观察点为 *(0, 0, -1)*，上方向为Y轴即 *(0, 1, 0)*。创建包含视点，视线以及上方向等信息的矩阵我们只需要以下代码：

```js
const viewMatrix = new Matrix4();
viewMatrix.setLookAt(0, 0, 0, 0, 0, -1, 0, 1, 0);
```

关于WebGL中使用的矩阵工具现在网上有很多的库，在这里推荐大家使用大名鼎鼎的antv的矩阵工具，矩阵工具路径为：*@antv/gl-matrix/src/gl-matrix/mat4.js*，*lookAt* 函数如下图：

![look-at-function](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/look-at-function.png)

同理，本文后续涉及到的其它函数也可以通过这种方法找到！

## 🔺具有前后关系的三角形

上面说到，我们需要创建一个视图矩阵传给顶点着色器：

```glsl
// ...
uniform mat4 u_ViewMatrix;

void main () {
  gl_Position = u_ViewMatrix * a_Position;
  v_Color = a_Color;
}
```

在JavaScript中将视图矩阵传递给顶点着色器：

```js
void main () {
  // ...

  const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');

  // 设置视点、视线和上方向
  const viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);

  // 将视图矩阵传给u_ViewMatrix
  gl.uniform4fv(u_ViewMatrix, false, viewMatrix.elements);

  // ...

  gl.drawArrays(gl.TRIANGLES, 0, n);
}
```

定义三角形坐标及其颜色，并创建缓冲区对象：

```js
function initVertexBuffers (gl) {
  const verticesColors = new Float32Array([
    // 坐标                            颜色
    0.0, 0.5, -0.4,         0.4, 1.0, 0.4,
    -0.5, -0.5, -0.4,     0.4, 1.0, 0.4,
    0.5, -0.5, -0.4,         1.0, 0.4, 0.4,

    0.5, 0.4, -0.2,         1.0, 0.4, 0.4,
    -0.5, 0.4, -0.2,        1.0, 1.0, 0.4,
    0.0, -0.6, -0.2,         1.0, 1.0, 0.4,

    0.0, 0.5, 0.0,             0.4, 0.4, 1.0,
    -0.5, -0.5, 0.0,         0.4, 0.4, 1.0,
    0.5, -0.5, 0.0,         1.0, 0.4, 0.4,
  ]);
  const n = 9;

  // 创建缓冲区对象
  const vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  // ...

  return n;
}
```

然后就可以在浏览器中看到如下效果：

![triangles](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/triangles.png)

是不是很棒🤩这样就绘制了三个具有前后关系的三角形啦！这是要提一下 **模型矩阵** 了，在之前的文章[《坐标系统中》](https://mp.weixin.qq.com/s?__biz=MzIxMzY1OTQxOQ==&mid=2247483800&idx=1&sn=d0e1ce2f5d7dcab439e915ec0465fd6a&scene=21#wechat_redirect)我们介绍了在从局部坐标转换到屏幕坐标的公式：

![coordinate-transform-formula](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/coordinate-transform-formula.png)

下面让我们使用模型矩阵对三角形来点操作🧙‍♂️首先在顶点着色器中定义模型矩阵变量：

```glsl
// ...
uniform mat4 u_ModelMatrix;

void main () {
  gl_Position = u_ViewMatrix * u_ModelMatrix * a_Position;
  v_Color = a_Color;
}
```

在JavaScript中向顶点着色器传递模型矩阵：

```js
function main () {
  // ...
  const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  const modelMatrix = new Matrix4();
  modelMatrix.setRotate(-10, 0, 0, 1);    // rotate 函数可使用 antv 中的函数
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // ...
}
```

然后就可以在浏览器中看到如下效果：

![another-three-triangles](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/another-three-triangles.png)

当然，我们也可以在JavaScript中将 *u_ViewMatrix * u_ModelMatrix* 的结果计算好之后再传给顶点着色器，就不再赘述。矩阵相乘可以使用 *antv* 的 *multiply* 函数：

![multiple-function](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/multiple-function.png)

现在的程序可以正常显示3个三角形，看似没什么问题，但是真的是这样吗？🤔让我们给程序加个按下方向键让三角形旋转的功能，以全方位360度地检查一下有没有什么问题吧！思路：监听 *keydown* 事件，每当用户按下方向键的时候就改变 *viewMatrix* 的值传给顶点着色器，并调用 *gl.clear* 和 *gl.drawArrays* 重绘。

实现之后，我们按一下方向键旋转我们的视角，如果你观察的仔细就会发现一个小问题，我们的三角形旋转之后为什么会少一个角呢？

![triangles-rotated](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/triangles-rotated.png)

这是因为我们没有指定 **可视范围**，也就是实际观察得到的区域边界。下面将会介绍可视范围！

## 🔎可视范围

在上篇文章中的裁剪空间小节中介绍到，在裁剪空间中可视空间有两种：

* [1] 盒状空间，由正射投影产生；
* [2] 四棱锥可视空间，由透视投影产生。

### 正射投影

首先，让我们来试一下正射投影的效果。先在顶点着色器中定义裁剪矩阵：

```glsl
// ...
uniform mat4 u_ProjMatrix;

void main () {
  gl_Position = u_ProjMatrix * a_Position;
  v_Color = a_Color;
}
```

因为正射投影产生的盒状空间是一个长方体，所以我们只需要指定盒状空间的：上、下、左、右边界，以及近裁剪面和远裁剪面的位置即可确定空间的可视区域！然后我们在JavaScript中定义裁剪矩阵并传给顶点着色器：

```js
function main () {
  // ...

  const u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  const projMatrix = new Matrix4();
  projMatrix.setOrtho(-1, 1, -1, 1, 0.0, 0.5);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  // ...
}
```

![triangles-front](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/triangles-front.png)

我们再给程序加上监听事件，当用户按下方向键的时候可以改变近裁剪面和远裁剪面的值，这样我们就可以深刻的感受到近裁剪面和远裁剪面对我们可视区域的影响了😜

上面说到我们视角旋转时发现三角形缺了个角是因为可视区域的影响，我们把可视区域调整一下再看一下还会不会产生这种问题呢？这是我们要搭配使用视图矩阵和裁剪矩阵了：

```glsl
// ...
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjMatrix;

void main () {
  gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position;
  v_Color = a_Color;
}
```

我们把远裁剪面调整一下，调整为2.0，再旋转到刚才的角度来看一下效果：

![triangle-rotated-fixed](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/triangle-rotated-fixed.png)

棒极啦，旋转之后也可以完整地显示三角形了👍

### 透视投影

透视投影产生的可视空间并不是四四方方的立方体，而是一个平截头体，像一个被截断的金字塔（图片来源：https://www.oreilly.com/library/view/programming-3d-applications/9781449363918/figs/p3da_0107.png）：

![p3da](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/p3da.png)

当我们要使用透视投影时，需要指定 **视野角度（FOV）**、近裁剪面的宽高比以及近裁剪面和远裁剪面的位置。下面让我们绘制几个三角形来看一下透视投影的效果，着色器程序相较于正射投影的并没有改变：

```js
function main () {
  // ...

  const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  const u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');

  const viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
  const projMatrix = new Matrix4();
  projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  // ...
}

function initVertexBuffers (gl) {
  const verticesColors = new Float32Array([
    0.75, 1.0, -4.0, 0.4, 1.0, 0.4,
    0.25, -1.0, -4.0, 0.4, 1.0, 0.4,
    1.25, -1.0, -4.0, 1.0, 0.4, 0.4,

    0.75, 1.0, -2.0, 1.0, 1.0, 0.4,
    0.25, -1.0, -2.0, 1.0, 1.0, 0.4,
    1.25, -1.0, -2.0, 1.0, 0.4, 0.4,

    0.75, 1.0, 0.0, 0.4, 0.4, 1.0,
    0.25, -1.0, 0.0, 0.4, 0.4, 1.0,
    1.25, -1.0, 0.0, 1.0, 0.4, 0.4,

    -0.75, 1.0, -4.0, 0.4, 1.0, 0.4,
    -1.25, -1.0, -4.0, 0.4, 1.0, 0.4,
    -0.25, -1.0, -4.0, 1.0, 0.4, 0.4,

    -0.75, 1.0, -2.0, 1.0, 1.0, 0.4,
    -1.25, -1.0, -2.0, 1.0, 1.0, 0.4,
    -0.25, -1.0, -2.0, 1.0, 0.4, 0.4,

    -0.75, 1.0, -0.0, 0.4, 0.4, 1.0,
    -1.25, -1.0, -0.0, 0.4, 0.4, 1.0,
    -0.25, -1.0, -0.0, 1.0, 0.4, 0.4,
  ]);

  const n = 18;

  // ...

  return n;
}
```

效果如图：

![fov-result](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/fov-result.png)

怎么样，这样是不是就更贴近我们的真实生活了！？离得远的物体看起来会更小😛但是在上面的程序中，我们绘制这6个三角形分别定义了6个三角形的顶点坐标和颜色信息，显得十分的冗余。我们既然已经学习了图形的变换，为什么不通过图形的平移来得到另一组三角形呢？首先定义初始化的三角形信息：

```js
function initVertexBuffers (gl) {
  const verticesColors = new Float32Array([
    // 绿色在最后面
    0.0, 1.0, -4.0, 0.4, 1.0, 0.4,
    -0.5, -1.0, -4.0, 0.4, 1.0, 0.4,
    0.5, -1.0, -4.0, 1.0, 0.4, 0.4,
        // 黄色在中间
    0.0, 1.0, -2.0, 1.0, 1.0, 0.4,
    -0.5, -1.0, -2.0, 1.0, 1.0, 0.4,
    0.5, -1.0, -2.0, 1.0, 0.4, 0.4,
        // 蓝色在前面
    0.0, 1.0, 0.0, 0.4, 0.4, 1.0,
    -0.5, -1.0, 0.0, 0.4, 0.4, 1.0,
    0.5, -1.0, 0.0, 1.0, 0.4, 0.4,
  ]);

  // ...

  return n;
}
```

接下来就是通过平移得到两组三角形：

```glsl
// ...
uniform mat4 u_FinalMatrix;

void main () {
  gl_Position = u_FinalMatrix * a_Position;
  v_Color = a_Color;
}
```

```js
function main () {
  // ...

  const u_FinalMatrix = gl.getUniformLocation(gl.program, 'u_FinalMatrix');
  const finalMatrix = new Matrix4();

  const projMatrix = new Matrix4();
  projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
  const viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
  const modelMatrix = new Matrix4();
  modelMatrix.setTranslate(0.75, 0, 0);
  // 矩阵乘法得到：裁剪矩阵 * 视图矩阵 * 模型矩阵 的计算结果
  finalMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
  gl.uniformMatrix4fv(u_FinalMatrix, false, finalMatrix.elements);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);

  // 平移三角形
  modelMatrix.setTranslate(-0.75, 0, 0);
  finalMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
  gl.uniformMatrix4fv(u_FinalMatrix, false, finalMatrix.elements);
  // 再次绘制，注意不要clear
  gl.drawArrays(gl.TRIANGLES, 0, n);
}
```

也可以得到相同的效果：

![fov-same-result](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/fov-same-result.png)

## 物体的前后关系

上面的例子中我们定义的三角形信息的顺序是从后向前：绿色三角形→黄色三角形→蓝色三角形，假如说我们把绿色三角形和蓝色三角形的定义顺序交换一下呢？

![triangles-position-exchange](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/triangles-position-exchange.png)

会发现又出现问题了！虽然绿色三角形的z轴坐标是-4.0也就是在三个三角形的最后面，但是因为交换了三角形数据的顺序，绿色三角形却显示在了最前面😱这可不是我们想要的结果！事实上，WebGL是按照缓冲区中的顺序来绘制图形的，后面绘制的图形会覆盖前面已经绘制好的图形，这样就产生了近处三角形遮挡远处三角形的效果。但是当我们将蓝色和绿色的顺序交换之后，绿色三角形的顶点信息就成为了缓冲区中的最后一个，所以绿色三角形会覆盖在前面绘制的两个三角形之上。如何解决这个问题呢？这时候我们就要开启深度测试：

```glsl
// 开启深度测试，开启隐藏面消除功能
gl.enable(gl.DEPTH_TEST);
// 在绘制之前，清除深度缓冲区
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
```

当加上这两句之后，就会解决刚才的问题！同时要注意，当物体表面极为接近时，会是表面看起来很斑斑驳驳，这种现象被称为深度冲突，WebGL提供了多边形偏移的机制来解决这个问题。该机制将自动在Z值上加上一个偏移量，偏移量的值由物体表面相对于观察者视线的角度来确定。启用该机制只需下面两行代码：

```glsl
gl.enable(gl.POLYGON_OFFSET_FILL);
gl.polygonOffset(factory, units);
```

*gl.polygonOffset* 指定加到每个顶点绘制后Z值上的偏移量，偏移量将按照公式 *m * factory + r * units* 计算，其中m表示顶点所在表面相对于观察者的视线的角度，r表示硬件能够区分两个z值之差的最小值。

## ✍️正射投影和透视投影矩阵的推导

上面介绍了可视空间的相关内容，以及常见问题的解决方法。下面让我们一起推导一下正射投影和透视投影的变换矩阵吧！

### 正射投影矩阵

因为正射投影产生的可视空间是个规则的立方体，所以我们只需要知道两个边界的点就可以确定整个可视空间的范围了：已知近裁剪面的左下角的点 *(l, b, n)* 和远裁剪面右上角的点 *(r, t, f)*。那么可视空间内的任意一点都满足：

![formula](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/formula.png)

我们需要将上面坐标范围转换为[-1, 1]形式，我们以x范围为例，首先同时减去l：

![minus-one](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/minus-one.png)

再同时乘2 / (r - l)，因为r >l故不用考虑不等式变号和分母为0的情况：

![multiple](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/multiple.png)

最后等式两边同时减1，即得：

![result](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/result.png)

令：

![set](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/set.png)

同理可得y'，按照同样的方式将z'映射到[0, 1]：

![mapping-result](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/mapping-result.png)

所以可得正射投影的变换矩阵为：

![matrix-result](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/matrix-result.png)

让我们来看一下antv中设置正交投影矩阵的函数，来验证一下我们的推导过程是否正确：

![antv-ortho](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/antv-ortho.png)

首先可以看到里面也参数也是接收了(l, b, n)和(r, t, f)两个边界点来确定可视空间，out参数是表示将结果写入哪里，与确定可视区域无关。因为WebGL中是列主序，所以我们把antv中的源码转换成我们熟知的矩阵应该是：

![matrix-result-transformed](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/matrix-result-transformed.png)

对比一下会发现z'的矩阵分量好像与antv不同，这是因为我们将z'分量映射到了[0, 1]这个范围，如果我们映射到[-1, 1]这个范围就会与antv中的相同了！同时，其它分量将分母l - r和b - t化成r - l和t - b，与我们推导的结果就会一致啦✌️

### 透视投影矩阵

对于透视投影矩阵，因为所产生的可视空间不同，所以并不能像上述正射投影矩阵一样推导，但是并不代表我们上面所推导的正射投影矩阵是徒劳的！首先看一下下图：

![perspective-coordinate](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/perspective-coordinate.png)

我们需要把可视区域内的点(x, y, z)投影到近裁剪面上也就是(?, ?, n)点，那么我们如何求出(?, ?, n)点的坐标呢？这就需要利用到三角形相似了，利用三角形相似可以很快速的求得投影到近裁剪面上点的坐标为（坐标1）：

![coordinate-1](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/coordinate-1.png)

下面我们就要像正射投影中一样将坐标映射到[-1, 1]区间内，因为上面我们已经求过了，所以在这里就不再赘述，但是要注意在透视投影中投影到近裁剪面的坐标是坐标1，所以我们将坐标1中的x坐标和y坐标带入：

![coordinate-1-replaced](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/coordinate-1-replaced.png)

即得：

![coordinate-1-result](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/coordinate-1-result.png)

再同乘z得：

![multiply-z](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/multiply-z.png)

但是现在看看结果的确有些奇怪，我们想获得下面形如下面公式一样的x'和y'表达式：

![expected](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/expected.png)

可是现在表达式中却有了变量z，下面我们只有再构造形如：

![z-formula](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/z-formula.png)

的表达式组成(x'z, y'z, z'z)，然后再同时除以z即可！想要求得上面公式中的j和k其实很简单，因为我们已知近裁剪面和远裁剪面上的两个点(l, b, n)和(r, t, f)，也就是说当点在近裁剪面即z = n时，我们映射的z'值应该是0，而当点在远裁剪面时即z = f时，映射的z'值应该是1：

![second-z-formula](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/second-z-formula.png)

解得：

![j-k-result](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/j-k-result.png)

即得：

![z-result](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/z-result.png)

在默认情况下，我们的齐次坐标的最后一个分量w为1，为了与上面保持统一我们可以将w转换为：w'z = z，所以最终可以得到下式：

![perspective-formula](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/perspective-formula.png)

这样我们就可以将投影后的坐标写成矩阵形式：

![perspective-matrix](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/perspective-matrix.png)

再想一下，如果我们的视域范围对称的，并且中心是z轴，此时r = -l并且t = -b，而视域范围的宽和高我们用w和h表示，再带入上面矩阵就可以得到：

![perspective-matrix-z](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/perspective-matrix-z.png)

![perspective-coordinate-z](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/perspective-coordinate-z.png)

如上图垂直可视范围为角α，视点到近裁剪面的距离为n，蓝色部分为可视区域，近裁剪面的高度为h，那么我们就可以得到：

![cot-alpha](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/cot-alpha.png)

并且，加入我们横纵比用r代替，即r = w / h，那么可以得到：

![cot-alpha-replaced-with-r](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/cot-alpha-replaced-with-r.png)

所以透视投影矩阵又可以转化为：

![perspective-matrix-transformed](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/perspective-matrix-transformed.png)

下面，我们还是进入antv的源码来检验一下我们的推导结果是否正确：

![perspective-antv](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/perspective-antv.png)

首先，perspective函数的fovy参数对应我们的α，aspect参数对应我们的横纵比r，near和far分别是近/远裁剪面，那么：

```js
let f = 1.0 / Math.tan(fovt / 2);    // 也就等于cot(α/2)

out[0] = cot(α/2) / r;
// ...
out[5] = cot(α/2);
// ...
out[11] = -1;    // 因为antv分母为near - far，而我们的是far - near，所以会相差一个负号
// 而out[10]和out[14]两个值因为将z值映射的区间不同所以会有差异（与正射投影中的同理）
```

棒极啦，看来我们推到的投影矩阵没有问题🎊都来到三维世界了，如果还一直与三角形纠缠不清，岂不是很失望？下面让我们来快速的绘制一个立方体吧💪

## 📦绘制立方体

绘制立方体，大家很容易想到，立方体有6个面、每个面有2个三角形、每个三角形有3个顶点：6 * 2 * 3，这么算下来我们要定义36个顶点的信息，可是明明立方体只有8个顶点，我们这么去做是不是有点太繁杂了！？然后又想到，我们之前有介绍过一种绘制方式可以绘制扇形，那么每个面我们定义4个点就可以绘制一个正方形啦！可是这种方式，我们需要调用6次 *gl.drawArrays*。WebGL为我们提供了一种更简便的方式：*gl.drawElements*！

*gl.drawElements* 的思路是什么呢？先来看一下下面这张图：

![draw-elements-principle](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/draw-elements-principle.jpeg)

首先我们将立方体分为：前、后、左、右、上、下六个面，每个面都由两个三角形组成，每个三角形对应一个索引数据，而每条索引数据中存储着每个顶点的索引值，而每个索引值对应的顶点信息就包含顶点的坐标以及颜色的数据。具体实现代码如下：

```js
function main () {
  // ...

  const u_FinalMatrix = gl.getUniformLocation(gl.program, 'u_FinalMatrix');
  const finalMatrix = new Matrix4();
  finalMatrix.setPerspective(30, 1, 1, 100);
  finalMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
  gl.uniformMatrix4fv(u_FinalMatrix, false, finalMatrix.elements);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers (gl) {
  const verticesColors = new Float32Array([
    // 顶点坐标           颜色
    1.0,  1.0,  1.0,     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,
    -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,
     1.0, -1.0,  1.0,     1.0,  1.0,  0.0,
     1.0, -1.0, -1.0,     0.0,  1.0,  0.0,
     1.0,  1.0, -1.0,     0.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,     0.0,  0.0,  1.0,
    -1.0, -1.0, -1.0,     0.0,  0.0,  0.0,
  ]);
  const indices = new Uint8Array([
    0, 1, 2,   0, 2, 3, // 前
    0, 3, 4,   0, 4, 5, // 右
    0, 5, 6,   0, 6, 1, // 上
    1, 6, 7,   1, 7, 2, // 左
    7, 4, 3,   7, 3, 2, // 下
    4, 7, 6,   4, 6, 5, // 后
  ]);

  const vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  // ...

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}
```

那么我们运行上面代码之后WebGL是怎么运作的呢🤔在调用 *gl.drawElements* 时，WebGL首先从绑定到 *gl.ELEMENT_ARRAY_BUFFER* 的缓冲区（也就是 *indexBuffer*）中获取到顶点的索引值；然后，根据该索引值从绑定到 *gl.ARRAY_BUFFER* 的缓冲区（即 *vertexColorBuffer*）中获取顶点坐标、颜色等信息；最后，传递给 *attribute* 变量并执行顶点着色器。在浏览器中的执行效果如图：

![cube-result](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-3d/cube-result.png)

## 🎬结束语

本次内容较多，主要包含了：

* [1] 视点、视线、被观察目标、正方向的介绍；
* [2] 三维空间中物体的深度关系，以及常见问题的解决方案和需要注意的点；
* [3] 正射/透视投影矩阵的推导；
* [4] 在三维世界绘制第一个立方体。

有趣的投影矩阵和三维世界就介绍到这里啦，后续会出更多好玩并且有用的文章分享给大家，感谢阅读🔚


发表于2020-05-25
