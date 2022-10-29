# 这个三角形，像极了我的前半生！

## 前言

上篇文章把你和 WebGL拉近了一个点的距离，或许你对 WebGL更有兴趣了💘亦或许你

![no-interest](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-triangle/no-interest.png)

既然都和“女神”搭上话了，为什么不再进一步发展却知难而退呢（像不像追求爱情时的你👀）？迎难而上才能获取“女神”的芳心💕当技术的“舔狗”，舔到最后应有尽有。

有人说WebGL门槛高，望而却步😖使用ThreeJS或D3难道门槛不高吗？不是不高，而是还没遇到棘手的问题，遇到问题最终还是要回到其本质来解决。

![not-easy](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-triangle/not-easy.png)

话说回来，现在就只离“女神”近了一点，切勿高兴太早，这次让我们通过基本图形三角形了解一下“女神”的另一面。

先来思考一下平时如何画一个三角形：

* [1] 在坐标系中找到每个坐标对应的点；
* [2] 将对应的点连接起来。

就这么简单？让我们来试一下，是不是如我们所期望的！

## 先来三个点儿

又看到了宇宙般深邃的黑色，忽然为*寂寞的夜空画上一个月亮*这句歌词闪入脑海，那就用黄色来绘制这三个点代表夜空中的繁星与明月吧（黄色：rgb(255, 255, 0)，具体修改片元着色器中的值即可不再赘述）🌙

> 本节代码基于上一篇[《你距离WebGL只差一点》](https://mp.weixin.qq.com/s/57__ynvaHqL29mZdB6INYg)

这次咱们换个方式来绘制点，毕竟充满新意爱情才能长久保鲜👩‍❤️‍👨不知各位在平时工作时有没有注意到`Float32Array`这种类型化数组，这种类型化数组因为在创建时就已经指定了其数据格式，所以在处理起来会更加高效，设计类型化数组的初衷也是因为了WebGL经常会同时处理大量的相同类型的数据，比如我们在创建点时的顶点坐标，颜色等。更多具体类型化数组可参考ECMA-262。

下面使用Float32Array创建三角形的三个顶点坐标：

```js
const vertices = new Float32Array([
  0.0, 0.5,
  -0.5, -0.5,
  0.5, -0.5,
]);
```

每个两个坐标分别代表顶点的(x, y)，该如何使用创建好的顶点数组呢？如下：

```js
const vertexBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const a_Position = gl.getAttribLocation(gl.program, 'a_Position');

gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

gl.enableVertexAttribArray(a_Position);
```

向顶点着色器传入多个顶点的数据，主要有下面 5 个步骤：

* [1] 创建缓冲区对象：`gl.createBuffer()`；
* [2] 绑定缓冲区对象：`gl.bindBuffer()`；
* [3] 将数据写入缓冲区对象：`gl.bufferData()`；
* [4] 将缓冲区对象分配给一个`attribute`变量：`gl.vertexAttribPointer()`；
* [5] 开启`attribute`变量：`gl.enableVertexAttribArray()`。

### 创建缓冲区对象

缓冲区对象是WebGL中的一块存储区，可以在其中保存所要绘制的顶点数据。当调用`createBuffer`方法之后，就会在WebGL系统中创建一个缓冲区对象（虚线部分）。

![buffer-object](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-triangle/buffer-object.png)

### 绑定缓冲区对象

可以看到`bindBuffer`方法有两个参数，第二个参数`vertexBuffer`，很好理解那么第一个参数`gl.ARRAY_BUFFER`又有何用途呢？其实就是将我们创建的缓冲区对象绑定到WebGL已有的“目标”上。而这个“目标”则表示了缓冲区对象的用途（详情请参考[`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)）：

| 目标 | 描述 |
| :- | :- |
| `gl.ARRAY_BUFFER` | 包含顶点属性的Buffer，如顶点坐标，纹理坐标数据或顶点颜色数据。 |
| `gl.ELEMENT_ARRAY_BUFFER` | 用于元素索引的Buffer。 |

绑定缓冲区对象之后就如下图：

![array-buffer](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-triangle/array-buffer.png)

### 向缓冲区对象写入数据

使用`bufferData()`方法就可以将vertices中的数据写入绑定到`gl.ARRAY_BUFFER`上的缓冲区对象了：

![write-data-to-array-buffer](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-triangle/write-data-to-array-buffer.png)

第三个参数则指定了数据存储区的使用方法（详情请参考bufferData）：

| 使用方法 | 描述 |
| :- | :- |
| `gl.STATIC_DRAW` | 缓冲区的内容可能经常使用，而不会更改。内容被写入缓冲区，但不被读取。 |
| `gl.DYNAMIC_DRAW` | 缓冲区的内容可能经常被使用，并且经常更改。内容被写入缓冲区，但不被读取。 |
| `gl.STREAM_DRAW` | 缓冲区的内容可能不会经常使用。内容被写入缓冲区，但不被读取。 |

### 将缓冲区对象分配给 attribute 变量

终于到了“分配对象”的环节，费那么大周章创建的缓冲区对象终于要给我们的变量使用了！

![sad](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-triangle/sad.png)

小朋友你是不是又在疑惑？为什么创建的顶点数组只有(x, y)没有z？这就要来介绍一下负责“分配对象”的`vertexAttribPointer`：第二个参数传入的 2，就是指定缓冲区中每个顶点的分量个数，假如指定的分量数小于`attribute`变量所需的分量数，那么缺失的分量就会按照相应规则自动补全（2，3 分量设为 0，4 分量设为 1），当然具体设为 1 还是 1.0 的float形式，还是要视情况而定哒（详情请参考[vertexAttribPointer](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer)）🧐

> `gl.enableVertexAttribArray()` 就不做过多介绍了，感兴趣请参考[gl.enableVertexAttribArray](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/enableVertexAttribArray)

看一下页面：

![yellow-points](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-triangle/yellow-points.png)

棒极了，黄色的点如璀璨的星光（译制片口吻）👀那么三个点都漏出来了，看到完整的一面还会远吗？

![xxx](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-triangle/xxx.jpeg)

## 把三个点变成三角形

那么接下来就是见证奇迹的时刻🎩把`drawArrays`方法中的第一个参数换成`gl.TRIANGLES`试一下：

![triangle](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-triangle/triangle.png)

Wow:) You can really… 既然顶点大小已经没用了，建议删掉顶点着色器中的`gl_PointSize`变量的赋值。除了`gl.POINTS` / `gl.TRIANGLES`，其它类型如下：

| 类型 | 描述 |
| :- | :- |
| `gl.POINTS` | 绘制一系列点。 |
| `gl.LINE_STRIP` | 绘制一个线条。即，绘制一系列线段，上一点连接下一点。 |
| `gl.LINE_LOOP` | 绘制一个线圈。即，绘制一系列线段，上一点连接下一点，并且最后一点与第一个点相连。 |
| `gl.LINES` | 绘制一系列单独线段。每两个点作为端点，线段之间不连接。 |
| `gl.TRIANGLE_STRIP` | 绘制一个三角带。 |
| `gl.TRIANGLE_FAN` | 绘制一个三角扇。 |
| `gl.TRIANGLES` | 绘制一系列三角形。每三个点作为顶点。 |

不同的类型绘制出的图案也不同，各位可以自己尝试一下哦😃

## 回顾一下

绘制一个三角形就像一个人的前半辈子，你是缓冲区对象，另一伴是`attribute`变量：

* [1] 你来到了这个世上：createBuffer；
* [2] 进入社会后找到了自己喜欢的那一行：bindBuffer；
* [3] 拼搏数年，终于有了车、房：bufferData；
* [4] 万幸还遇到了喜欢的姑娘：vertexAttribPointer；
* [5] 你们爱上了对方：enableVertexAttribArray；
* [6] 并开始谱写新的乐章：drawArrays✍️

还挺押韵，skr🤙

## 结束语

使用原生WebGL绘制一个三角形就讲到这里啦:)自己也在不断的学习中，后续会出更多关于WebGL的文章，目前在看《WebGL Programming Guide》学习WebGL相关知识，所以这些文章是阅读完书籍的相关章节后写的总结及感受😋

预告：下一篇文章将介绍如何对本篇绘制的三角形进行缩放、平移等变换🤘

发表于2020-04-12
