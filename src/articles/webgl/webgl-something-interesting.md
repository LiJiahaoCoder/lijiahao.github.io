# WebGL 说点高级的东西

## 📗前言

最近身体不适拖更了一段时间，十分抱歉！

在之前的WebGL基础的系列文章中，我们学习了图形变换、坐标系统、变量内插过程、光照、GLSL ES基础语法等内容。为了给WebGL基础系列文章画上一个圆满的句号，本文将会介绍如何应用之前讲的知识实现一些更加复杂且实用的功能，比如：鼠标控制物体旋转、选择立方体、选择立方体的某个面等🤩

话不多说，下面开整😜

## 🔨整

### 🟠绘制圆点

在之前绘制点的文章中，我们就知道了在屏幕上绘制的点是一个个方块，所以如果我们想要绘制一个圆点，那么就要像素描一样“切”去不必要的点🔪顶点着色器和片元着色器之间发生了光栅化过程，一个顶点被光栅化为了多个片元，每个片元都会经过片元着色器的处理。如果直接绘制，画出的点是方形的，可是如果在片元着色器中做一些改动的话，只绘制圆圈以内的片元，这样就可以绘制出圆形的点了(Excel是个无情的工具hhhh)：

![fragment-circle](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-somthing-interesting/fragment-circle.png)

为了将浅色部分的片元剔除掉，我们需要知道每个片元在光栅化过程中的坐标。当然GLSL ES也为我们提供了相应内置变量供我们使用：*gl_FragCoord* 和 *gl_PointCoord*，*gl_FragCoord* 表示片元的窗口坐标，*gl_PointCoord* 表示片元在被绘制的点内的坐标（范围为[0.0, 1.0]）。我们在之前绘制蓝色点代码的片元着色器上做些改动：

```glsl
void main() {
  float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
  if (dist < 0.5) {
    gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
  } else { discard; }
}
```

我们只处理并显示距离为0.5以内点（即点的半径为0.5），还记得discard语句吗？我们在GLSL ES语法基础一文的结束语中提到过😉只需要做上面一些改动，我们就能在浏览器中看到一个圆形的点啦：

![blue-circle](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-somthing-interesting/blue-circle.png)

### 🖱鼠标控制旋转立方体

旋转物体实际上是根据当前鼠标的移动情况创建相应的旋转矩阵，并更新模型、视图以及投影矩阵。首先，我们在 *main()* 中定义一个变量保存当前物体旋转的角度：

```js
let currentAngle = [ 0.0, 0.0 ];

// 注册鼠标事件
initEventHandlers( canvas, currentAngle );
```

接下来，我们根据鼠标的移动计算出相应的旋转角度：

```js
function initEventHandlers ( canvas, currentAngle ) {
  let dragging = false;    // 当前是否在拖动
  let lastX = 0, lastY = 0;    //  鼠标的最后位置

  // 按下鼠标
  canvas.onmousedown = function ( ev ) {
    const x = ev.clientX, y = ev.clientY;
    // 如果鼠标在 canvas 内就开始拖动
    const rect = ev.target.getBoundingClientRect();
    if ( rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom ) {
      laxtX = x; lastY = y;
      dragging = true;
    }
  }

  // 松开鼠标
  canvas.onmouseup = function ( ev ) { dragging = false; }

  // 移动鼠标
  canvas.onmousemove = function ( ev ) {
    const x = ev.clientX, y = ev.clientY;
    if ( dragging ) {
      const factor = 100 / canvas.height;    // 旋转因子
      const dx = factor * ( x - lastX );
      const dy = factor * ( y - lastY );
      // 将 y 轴旋转角度控制在[90, -90]度
      currentAngle[ 0 ] = Math.max( Math.min( currentAngle[ 0 ] + dy, 90.0 ), -90.0 );
      currentAngle[ 1 ] = currentAngle[ 1 ] + dx;
    }
    lastX = x, lastY = y;
  }
}
```

最后，根据计算出的旋转角度更新相应矩阵的值：

```js
const g_FinalMatrix = new Matrix4();
function draw ( gl, n, viewProjMatrix, u_FinalMatrix, currentAngle ) {
  g_FinalMatrix.set( viewProjMatrix );
  g_FinalMatrix.rotate( currentAngle[0], 1.0, 0.0, 0.0 );
  g_FinalMatrix.rotate( currentAngle[1], 0.0, 1.0, 0.0 );
  gl.uniformMatrix4fv( u_FinalMatrix, false, g_FinalMatrix.elements );

  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
  gl.drawElements( gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0 );
}
```

最终效果如下图（为了旋转更加明显，我为立方体增加了纹理贴图）：

![drag-cube](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-somthing-interesting/drag-cube.gif)

### 🍞选择物体

使用过Maya/3D Max等软件的的小伙伴应该知道，在建模的时候我们可以选择某个模型，并且也可以选择模型的某一个面，从而进行拉伸等一系列操作。那么在WebGL中，假如你想选择一个物体，可以遵循以下步骤：

* [1] 当鼠标按下时，将整个物体重绘成单一颜色；
* [2] 读取鼠标点击处的像素颜色（比如设为红色）；
* [3] 使用立方体原来的颜色进行重绘；
* [4] 如果步骤2读取到的颜色是红色，则做出相应提示。

首先，修改一下顶点着色器（片元着色器无需改动）：

```glsl
// ...
uniform bool u_Clicked;

void main () {
  gl_Position = u_FinalMatrix * a_Position;
  if (u_Clicked) {
    v_Color = vec4(1.0, 0.0, 0.0, 1.0);
  } else {
    v_Color = a_Color;
  }
}
```

然后，我们要获取到鼠标在canvas中点击的位置：

```js
function main () {
  // ...
  const u_Clicked = gl.getUniformLocation(gl.program, 'u_Clicked');
  gl.uniform1i(u_Clicked, 0);

  canvas.onmousedown = function( ev ) {
    let x = ev.clientX, y = ev.clientY;
    let rect = ev.target.getBoundingClientRect();
    if ( rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom ) {
      let x_in_canvas = x - rect.left, y_in_canvas = rect.bottom - y;
      let picked = check( gl, n, x_in_canvas, y_in_canvas, currentAngle, u_Clicked, viewProjMatrix, u_FinalMatrix );
      if ( picked ) alert('点击了立方体! ');
    }
}
```

check方法是用来检测鼠标是否点击到物体的，下面我们来实现check方法：

```js
function check (
  gl,
  n,
  x,
  y,
  currentAngle,
  u_Clicked,
  viewProjMatrix,
  u_FinalMatrix,
) {
  let picked = false;
  gl.uniform1i( u_Clicked, 1 );    // 将立方体置为红色
  draw( gl, n, currentAngle, viewProjMatrix, u_FinalMatrix );

  // 读取点击位置的像素颜色值
  const pixels = new Uint8Array( 4 );
  gl.readPixels( x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels );

  // 如果 R 值为255，说明点击在了物体上
  if ( pixels[0] == 255 ) {
    picked = true;
  }

  gl.uniform1i(u_Clicked, 0);    // 将u_Clicked设为false，用原来的颜色重绘物体
  draw( gl, n, currentAngle, viewProjMatrix, u_FinalMatrix );

  return picked;
}
```

看一下最终效果：

![select-object-alert](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-somthing-interesting/select-object-alert.gif)

对于有多个物体的场景，这个简单的方法也适用，只需要为场景中每个物体都指定不同的颜色即可。通常来说，颜色缓冲区单个像素R、G、B、A每个分量都是8比特，也就是说，仅使用R分量就可以区分255个物体了。对于一些比较复杂的三维模型，我们可以采用简化的模型或缩小绘图区域的方法来达到目的。

假如你理解了选择物体的的原理，那么选择立方体的某个表面对你来说就很简单了。以上面的立方体为例，我们需要为每个表面进行编号，当鼠标点击的时候就通过当前点击的像素区域获取到表面的编号，然后将相应表面置为白色以反馈用户。再次就不赘述实现过程了，直接贴出结果：

![select-cube-face](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-somthing-interesting/select-cube-face.gif)

### 🌫雾化

雾化通俗点来说就是离得远的东西看起来更模糊一些，这也是现实生活中很常见的一种现象。那么该如何实现雾化这一效果呢？我们以线性雾化为例，在线性雾化中，某一点的雾化程度取决于它与视点之间的距离，距离越远雾化程度越高。线性雾化有起点和终点，起点表示雾化开始之处，终点表示完全雾化之处，两点之间某一点的雾化程度与该点与视点的距离呈线性关系。某一点的雾化程度可以被定义为雾化因子，并在线性雾化公式中被计算出来：

![fog-factor](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-somthing-interesting/fog-factor.png)

同时：

![fog-conditions](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-somthing-interesting/fog-conditions.png)

如果雾化因子为1.0，则表示该点完全没有被雾化，可以很清晰地看到此处的物体；如果雾化因子为0.0，则表示该点已被完全雾化，此处的物体不可见。


在片元着色器中，根据雾化因子计算片元颜色公式如下：

![fragment-fog-formula](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-somthing-interesting/fragment-fog-formula.png)

首先，我们根据上述公式修改一下顶点着色器和片元着色器：

```glsl
/* 顶点着色器 */

// ...
uniform mat4 u_ModelMatrix;
uniform vec4 u_Eye;
varying float v_Dist;

void main () {
  // ...
  v_Dist = distance(u_ModelMatrix * a_Position, u_Eye);
}

/* 片元着色器 */

// ...
uniform vec3 u_FogColor;
uniform vec2 u_FogDist;
varying float v_Dist;

void main () {
  float fogFactor = clamp((u_FogDist.y - v_Dist) / (u_FogDist.y - u_FogDist.x), 0.0, 1.0);
  vec3 color = mix(u_FogColor, vec3(v_Color), fogFactor);
  gl_FragColor = vec4(color, v_Color.a);
}
```

接下来我们在JavaScript中传入着色器需要的值：

```js
function main () {
  // ...

  // 雾的颜色
  const fogColor = new Float32Array([0.137, 0.231, 0.423]);
  // 雾化的起点和终点
  const fogDist = new Float32Array([55, 80]);
  // 视点在世界坐标系下的位置
  const eye = new Float32Array([25, 65, 35, 1.0]);

  gl.uniform3fv(u_FogColor, fogColor);
  gl.uniform2fv(u_FogDist, fogDist);
  gl.uniform4fv(u_Eye, eye);

  // ...

  // 设置背景色并开启消除隐藏面功能
  gl.clearColor(fogColor[0], fogColor[1], fogColor[2], 1.0); // Color of Fog
  gl.enable(gl.DEPTH_TEST);

  // ...
  finalMatrix.lookAt(eye[0], eye[1], eye[2], 0, 2, 0, 0, 1, 0);
  // ...
}
```

为了方便大家观察效果，我为程序添加了一些交互，通过按键盘上的上/下键可以修改雾化的终点值：

![fog-cube](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-somthing-interesting/fog-cube.gif)

## 🎬结束语

WebGL基础系列文章就告一段落了，接下来准备看刚入手的《计算机图形学导论》，届时也会把自己的学习心得分享给大家😉后续还打算出《ThreeJS 源码剖析》系列来记录自己学习ThreeJs的点点滴滴🥳

发表于2020-06-14
