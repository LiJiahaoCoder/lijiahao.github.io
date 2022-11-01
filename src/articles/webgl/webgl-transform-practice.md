# WebGL 简单的图形变换！

## 前言

之前的[《客官，进来看看图形的几何变换》](https://mp.weixin.qq.com/s/LsDRJ6iJ5q1kNJA6xdADGQ)一文从理论上讲解并推导了图形变换的过程，那么本文将结合理论实操一波😃

## ⚡️闪现

难道不疑惑游戏中的闪现如何实现吗？这次让我们用三角形做一个“阉割版闪现”，实现效果为：当按下F键时，三角形闪现到canvas的右上方（闪现键是F我还是问的室友:P）🤩首先要明确一点，闪现“技能”对应的是我们图形变换中的“平移”这一行为。在上学时就学过，计算一个点平移后的坐标其实就是矢量相加的操作：

![translate-coordinate](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform-practice/translate-coordinate.png)

![translate-formula](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform-practice/translate-formula.png)

所以转换成我们的代码就是：

```js
const VertexShader = `
  attribute vec4 a_Position;
  uniform vec4 u_Translation;
  void main() {
      gl_Position = u_Translation + a_Position;
  }
`;
// ...
function main () {
  // ...
  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  const u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
  gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
  gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0);    // Tx, Ty, Tz 为在三个分量上的平移距离
  // ...
}
// ...
```

![translate-result](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform-practice/translate-result.png)

这样三角形就出现在了 *canvas* 的右上角:)然后在添加键盘的监听事件⌨️

```js
window.addEventListener('keydown', function(ev) {
  if (ev.keyCode === 70) {
    const u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');    // (1)
    gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0);    // (2)

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }
}, true);
// 记得删去上一步中在main()中添加的(1)和(2)
```

这样当我们按下F时，三角形就会出现在我们的右上角。

## 💃和Donna跳一支探戈

如果你不知道Donna是谁，那就去看一下《闻香识女人》吧:P Donna接受你的邀请之后，你要确定以下三件事情：

* [1] 旋转轴（Donna 绕你哪个胳膊转呢？）；
* [2] 旋转方向（Donna 是按照哪个方向转呢？）；
* [3] 旋转角度。

首先声明一下，在WebGL中默认是右手旋转法则，所谓右手旋转法则就是：右手握拳，大拇指伸直并指向旋转轴的正方向，其余几个手指就指明了旋转的正方向（多么熟悉的手法）👍🏻图形变换一文中我们推导出了一个点旋转 *θ* 角后的坐标：

![rotate-formula](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform-practice/rotate-formula.png)

那么我们就开始让 Donna 沿正方向（逆时针）旋转45度吧。首先让我们把角度转换成弧度制，并计算出其 *sin* 和 *cos*：

```js
const Angle = Math.PI * 45.0 / 180.0;
const Sin = Math.sin(Angle);
const Cos = Math.cos(Angle);
```

然后，修改顶点着色器：

```js
const VertexShader = `
  attribute vec4 a_Position;
  uniform float u_Sin, u_Cos;
  void main() {
    gl_Position.x = a_Position.x * u_Cos - a_Position.y * u_Sin;
    gl_Position.y = a_Position.x * u_Sin + a_Position.y * u_Cos;
    gl_Position.z = a_Position.z;
    gl_Position.w = 1.0;
  }
`;
```

最后，给 *uniform* 变量传值：

```js
var u_Sin = gl.getUniformLocation(gl.program, 'u_Sin');
var u_Cos = gl.getUniformLocation(gl.program, 'u_Cos');

gl.uniform1f(u_Sin, Sin);
gl.uniform1f(u_Cos, Cos);
```

![rotate-result](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform-practice/rotate-result.png)

然后我们就能在浏览器看到旋转后的三角形了，但是怎么变形了呢？因为我们的画布并不是一个正方形，并且我们使用的坐标是相对于画布而言的 *[-1.0, 1.0]* 的形式，所以三角形顶点的坐标与原点是相对的，而不是绝对的距离坐标原点的距离。那么我们就先把画布改成 *400px x 400px* 的一个正方形吧:)

一阵操作，索然无味😐感觉没什么特别的呢？有没有发现，我们到现在还没有用过变换矩阵呢？在这个例子中我们绕z轴旋转了45度，那么参考之前说过的绕z轴旋转的变换矩阵应该是：

![rotate-matrix](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform-practice/rotate-matrix.png)

那就让我们来定义一下我们的变换矩阵吧：

```js
const RotationMat = new Float32Array([
  Cos, -Sin, 0, 0,
  Sin, Cos, 0, 0,
  0.0, 0.0, 1.0, 0.0,
  0.0, 0.0, 0.0, 1.0,
]);
```

并且在顶点着色器中定义一个 *mat4* 类型的 *uniform* 变量接收变换矩阵：

```js
let VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_RotationMat;
  void main () {
    gl_Position = u_RotationMat * a_Position;    // 注意矩阵乘法的顺序！！！
  }
`;
```

将变换矩阵传递给顶点着色器：

```js
var u_RotationMat = gl.getUniformLocation(gl.program, 'u_RotationMat');
gl.uniformMatrix4fv(u_RotationMat, false, RotationMat);
```

来看看效果：

![rotate-fixed-result](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform-practice/rotate-fixed-result.png)

又有问题了！三角形怎么顺时针旋转了45度呢？其实矩阵中存储元素分为按行主序和按列主序两种，WebGL和OpenGL一样，矩阵的元素是按列主序存储在数组中的。所以我们就需要改一下我们RotationMat中的元素顺序了：

```js
const RotationMat = new Float32Array([
  Cos, Sin, 0, 0,
  -Sin, Cos, 0, 0,
  0.0, 0.0, 1.0, 0.0,
  0.0, 0.0, 0.0, 1.0,
]);
```

然后再看一下浏览器，就会发现三角形的旋转正常了，可以和 Donna 快乐的跳探戈了💃

## 🐵金箍棒

西游记中孙悟空从东海龙宫取定海神针时有一场景是，孙悟空对着定海神针说“大，大，大”，随后定海神针就开始越来越大。这对应到我们的图形变换中，就是所谓的 **缩放**！

缩放的变换矩阵：

![scale-matrix](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform-practice/scale-matrix.png)

同理，我们在顶点着色器中新建一个 *mat4* 类型的 *uniform* 变量接收缩放变换的矩阵，并且在JavaScript中将变换矩阵传到顶点着色器中。代码与上面旋转相似，故不赘述。

**但要注意矩阵的相乘顺序！！！**

## 结束语

平移、缩放和旋转的操作就说这么多，对于复合变换来说，其实就是三种变换的组合，将变换矩阵按顺序相乘即可:)

做一个小小的回顾，目前已经讲了三角形的绘制，以及变换。那么是否就可以写一些简单的动画了呢？比如规律性移动轨迹、键盘控制图形的大小、位置的操作。提示：动画使用 *requestAnimationFrame*。

有趣的图形变换就介绍到这里啦，后续会出更多好玩并且有用的文章分享给大家，感谢阅读~

发表于2020-04-16
