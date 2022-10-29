# 你距离 WebGL 只差一点！

你距离了解 *WebGL* 只差一点：

![a-little](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-start/a-little.jpeg)

这次，我会通过绘制一个点，带领大家走进*WebGL*的世界！并且不会涉及D3 / ThreeJS等WebGL库，就用原生的*WebGL API*绘制一个点！

## 📒前言

首先，WebGL并不是一门语言，它是一个标准，它是在OpenGL ES的基础上所建立的一套适用于浏览器的图形学标准；而OpenGL ES则是OpenGL的一个特殊版本（套娃警告👀），ES版本被广泛的应用于手机、家用游戏机等设备。想了解更多关于WebGL标准内容的小伙伴可以进入Khronos Group的网站自行浏览。

WebGL的开发与我们普通的前端开发并没有什么太大差异，一个浏览器的网页一般是由：HTML、 JavaScript、渲染引擎等部分组成，如果我们要开发WebGL的话，还需要什么呢？让我们来思考一下，我们在高中学习几何的时候老师讲过“点动成线，线动成面，面动成体”，那我们就以最基础的点为例，首先点有什么属性么？点的位置、点的颜色、点的大小，我们如何定义一个点的这些属性呢？这就要引入GLSL ES(OpenGL Shader Language ES)（后称着色器）了，着色器的写法与C语言语法有些相似，从名字也能看出WebGL与OpenGL ES是有“血缘关系”的！其次，我们还需要的就是浏览器厂商基于WebGL标准提供的API。

WebGL并不像OpenGL一样有繁琐的环境配置的流程，也没有对系统的要求，只要有一个支持WebGL的浏览器即可！

> 本次我们使用字符串的形式编写着色器，暂时不新建单独的着色器文件:)

## 🌏给这个“点”一点自由的空间

为了使用浏览器提供的WebGL接口，我们需要使用`<canvas>`来获取WebGL上下文：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Point</title>
</head>
<body onload="main()" style="padding: 0; margin: 0;">
  <canvas id="webgl" width="600" height="400">
    您使用的浏览器不支持 WebGL！
  </canvas>
  <script>
      function main() {
      // get canvas element
          const canvas = document.getElementById("webgl");
      const gl = canvas.getContext('webgl');
    }
  </script>
</body>
</html>
```

`gl`就是我们所获取到的WebGL渲染的上下文🤩让我们给画布填充个背景色吧：

```html
<!DOCTYPE html>
<html lang="en">
    <!-- ... -->
  <script>
      function main() {
      // ...
      const gl = canvas.getContext('webgl');

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
  </script>
    <!-- ... -->
</html>
```

这样我们要绘制点的画布就拥有了浩瀚宇宙一般深邃的黑色:)喝点庆祝一下🍺

![black-canvas](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-start/black-canvas.png)

解释一下`gl.clearColor`方法是设置清除画布的背景色，形式是`RGBA`；`gl.clear`则是调用清除画布的方法，可传递的参数`gl.COLOR_BUFFER_BIT`是个什么呢🧐其实该方法继承自OpenGL，OpenGL是基于多缓冲区模型的，清空绘图区域实际上是在清空颜色缓冲区，传递参数`gl.COLOR_BUFFER_BIT`是在告诉WebGL清空颜色缓冲区；除此之外还有深度缓冲区以及模板缓冲区。

## 🐵让距离近一“点”

下面我们开始绘制点🥳在前面我们分析道一个点有位置、颜色及大小三个属性，下面我们将编写着色器给深邃的画布增添一点色彩🌈

```html
<!DOCTYPE html>
<html lang="en">
    <!-- ... -->
  <script>
      function main() {
      // ...
      const VertexShader = `
        void main() {
          gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
          gl_PointSize = 10.0;
        }
      `;
      const FragmentShader = `
        void main() {
          gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
        }
      `;
    }
  </script>
    <!-- ... -->
</html>
```

上面我们定义了`VertexShader`和`FragmentShader`，在WebGL中有两种着色器分别是：顶点着色器和片元着色器：

* 顶点着色器：用来描述顶点的特性的程序，比如位置、大小等。顶点是指二维或三维空间中的一个点，比如二维图形或三维图形的顶点或交点；
* 片元着色器：也称像素着色器，进行逐片的处理过程比如光照。片元可以理解为像素。

同时，每个着色器都有一个`main()`方法，并且该方法不能指定参数，每行语句结束之后必须有分号！！！`gl_Position`、`gl_PointSize`和`gl_FragColor`三个变量则是着色器内置的变量，其中`gl_PointSize`可以不赋值，默认值为1.0。各位注意到，上面赋值语句中我们给的值是0.0而不是0，这是因为这些内置变量是有其变量类型的：

| 变量名 | 类型 | 描述 |
| :- | :- | :- |
| gl_Position | vec4 | 顶点位置 |
| gl_PointSize | float | 点的大小 |
| gl_FragColor | vec4 | 片元颜色 |

问：明明一个点的坐标只有`(x, y, z)`，为什么要传4个值呢？

答：这里使用的是齐次坐标的形式，了解齐次坐标可查看我上篇文章[《客官，进来看看图形的几何变换？》](https://mp.weixin.qq.com/s/-aZ3tUgMv0uGOmbov-RRhw)。

问：使用上面定义的顶点着色器和片元着色器分几步呢？

答：分三步！第一步，创建着色器；第二步，创建着色器程序；第三步，在WebGL上下文中使用着色器程序。

### 1️⃣创建着色器

为了方便使用我把创建着色器的步骤抽取了一个`createShader()`方法：

```js
function createShader (gl, type, source) {
  const shader = gl.createShader(type);
  if (shader == null) {
    console.warn('无法创建着色器');
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    console.log('编译着色器失败： ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
```

`gl.shaderSource`是将`gl.createShader`创建的着色器的`source`设置为我们定义的`VertexShader`或`FragmentShader`，剩下的就不解释了，函数名都很表意:)

### 2️⃣创建着色器程序

也为了更简洁，创建着色器程序的步骤也抽成了`createProgram()`方法：

```js
function createProgram (gl, vshader, fshader) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vshader);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    console.warn('Link 着色器程序失败： ' + gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  return program;
}
```

`gl.attachShader`是将创建好的着色器attach到我们着色器程序上，然后调用`gl.linkProgram`方法将program整合起来。

### 3️⃣在上下文中使用着色器程序

```js
function initShaders(gl, vshader, fshader) {
  const program = createProgram(gl, vshader, fshader);
  if (!program) {
    console.warn('创建着色器程序失败！');
    return false;
  }

  gl.useProgram(program);
  gl.program = program;

  return true;
}
```

这里就很简单啦，就不做过多介绍了！然后在`main()`中调用此方法初始化着色器：

```html
<!DOCTYPE html>
<html lang="en">
    <!-- ... -->
  <script>
      function main() {
      const canvas = document.getElementById('webgl');
      const gl = canvas.getContext('webgl');

      if (!initShaders(gl, VertexShader, FragmentShader)) {
        return alert('初始化着色器失败');
      }

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, 1);
    }
    // createShader
    // createProgram
    // initShaders
  </script>
    <!-- ... -->
</html>
```

`gl.drawArrays`的第一个参数是指定绘制方式，第二个参数是从哪个顶点开始绘制，第三个参数是指定绘制要用到多少个顶点。这样我们就能在黑色的画布上的正中心看到一个蓝色的点：

![blue-point](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-start/blue-point.png)

但是，小朋友你是否有很多的问号？

![tom-question](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-start/tom-question.jpeg)

明明定义的点的位置在(0, 0, 0)，为什么点会出现在`<canvas>`的正中央呢？WebGL相对于`<canvas>`的位置如下图：

![webgl-coordinate](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-start/webgl-coordinate.png)

中间的是WebGL相对于`<canvas>`的坐标，而`canvas`的坐标则是相对于屏幕的！WebGL相对于`<canvas>`的坐标并不是绝对的像素值，而是相对的[-1.0, 1.0]。🌰举个例子：我们展示的点在`canvas`的正中央，如果我们把点的坐标设置为(1.0, 0.0, 0.0, 1.0)，那么点就会出现在`canvas`的最右侧，同理设置为(-1.0, 1.0, 0.0, 1.0)，点则展示在`canvas`的左上角:P

## 🕹渲染这个点经历了什么？

![webgl-process](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-start/webgl-process.png)

## 🤨就这么结束了？

怎么可能就这么结束！让我们给绘制点的程序升级一下，现在我们的位置、大小都是在着色器中定义好的。当然WebGL也为我们提供了方法让我们可以从外部传入相应参数值。让我们对着色器改造一下：

```js
const VertexShader = `
  attribute vec4 a_Position;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = 10.0;
  }
`;
```

`attribute`是一种GLSL SE变量，被用来从外部向顶点着色器内传数据，只有顶点着色器可以使用；同时还有一种变量类型`uniform`，`uniform`变量传输的是对于所有顶点都相同（或与顶点无关）的数据。上面是着色器代码中，我们将从外部获取到的`a_Position`和`a_PointSize`分别赋值给`gl_Position`和`gl_PointSize`。怎么通过`JavaScript`向着色器的`attribute`变量传值呢？

```js
function main () {
  // ...
  if (!initShaders(gl, VertexShader, FragmentShader)) {
    return alert('初始化着色器失败');
  }

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttrib3f(a_Position, 1.0, 0.0, 0.0);
  // ...
}
```

使用`vertextAttrib3f`方法就可以将使用`getAttribLocation`获取到的`attribute`变量赋值，`vertexAttrib3f`方法会将齐次坐标的最后一个值默认赋值为1.0，当然使用`vertexAttrib4f`也是可以的:)

### 🤩再加点功能

当我在`canvas`上点击的时候，就在点击`canvas`的地方展示一个点，这就需要我们给`canvas`绑定方法了：

```js
canvas.onmousedown = function (e) {
  click(e, gl, canvas, a_Position);
};
```

在此就不给详细代码了，`canvas`绑定事件方式如上，并简单说一下思路：当点击之后获取鼠标在`canvas`点击的坐标值；然后将坐标转换为WebGL相对于`canvas`的[-1.0, 1.0]形式的坐标；然后清空画布，在重新绘制点。坐标转换的代码如下：

```js
let x = e.clientX;
let y = e.clientY;
const rect = e.target.getBoundingClientRect();

x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
y = (canvas.height / 2 - y + rect.top) / (canvas.height / 2);
```

比如还能再给每个点设置不同的颜色，**提示：使用 uniform 变量**。

## 🤠结束语

使用原生WebGL绘制一个“简单的点”就讲到这里啦:)自己也在不断的学习中，后续会出更多关于WebGL的文章😋

发表于2020-04-09
