# WebGL 变量的内插过程

上一篇文章中讲了在WebGL中使用齐次坐标对三角形进行变换，目前也可以通过 *gl.drawArrays* 方法绘制更加复杂的图形，这次让我们更进一步，给你的“女神”挑选一件漂亮的衣服吧👗挑选衣服之前，先让我们回归到最初的那三个点。

## 🎬又回到最初的起点

![three-points](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-variable-insert/three-points.png)

还记不记得这熟悉的三个点？在绘制三个点的例子中，我们在顶点着色器中使用了 *gl_PointSize=10.0* 这种方式将每个点的大小设置为10像素。但是如果我们想要3个大小不同的点呢？我们需要在顶点着色器中分别定义3个 *attribute* 变量接收不同的点的 *size* 吗🧐

不必如此，还记不记得我们将顶点坐标信息存入缓冲区对象，并写入 *attribute* 变量？定义不同大小的顶点坐标也可以使用这种方式：

```js
const VertexShader = `
  // ...
  attribute float a_PointSize;
  void main() {
    // ...
    gl_PointSize = a_PointSize;
  }
`;

// ...

function initVertexBuffers (gl) {
  // ...
  const sizes = new Float32Array([
    10.0, 20.0, 30.0,
  ]);

  // 将顶点大小数据写入缓冲区
  const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  const sizeBuffer = gl.createBuffer();    // create -> 你来到这个世上
  gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer); // bind -> 找到喜欢的行当
  gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW); // data -> 有车有房
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0); // pointer -> 爱上对方(attribute 变量)
  gl.enableVertexAttribArray(a_PointSize); // enable -> 谱写新的篇章
}
```

![three-points-sized](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-variable-insert/three-points-sized.png)

这样就可以看到三个不同大小的点了！还能不能再方便一些？按理说顶点大小与顶点坐标都属于顶点的一个属性，我们可不可以把这些信息放在一起呢？说到这儿，还记不记得之前说过 *gl.vertexAttribPointer* 方法中可以传入 *offset*👏

```js
/**
 * @param index       指定要修改的顶点属性的索引。
 * @param size        指定每个顶点属性的组成数量，必须是1，2，3或4。
 * @param type        指定数组中每个元素的数据类型：
 *                       gl.BYTE: 有符号的8位整数，范围[-128, 127];
 *                       gl.SHORT: 有符号的16位整数，范围[-32768, 32767];
 *                       gl.UNSIGNED_BYTE: 无符号的8位整数，范围[0, 255];
 *                       gl.UNSIGNED_SHORT: 无符号的16位整数，范围[0, 65535];
 *                       gl.FLOAT: 32位IEEE标准的浮点数;
 * @param normalized  当转换为浮点数时是否应该将整数数值归一化到特定的范围。
 * @param stride      以字节为单位指定连续顶点属性开始之间的偏移量(即数组中一行长度)。不能大于255。
 *                    如果stride为0，则假定该属性是紧密打包的，即不交错属性，每个属性在一个单独的块
 *                    中，下一个顶点的属性紧跟当前顶点之后。
 * @param offset      指定顶点属性数组中第一部分的字节偏移量，必须是类型的字节长度的倍数。
 */
gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
```

先将顶点坐标与大小写入一个变量中：

```js
const verticesSizes = new Float32Array([
  0.0, 0.5, 10.0,
  -0.5, -0.5, 20.0,
  0.5, -0.5, 30.0,
]);
```

看一下上面每个参数的含义，前面的就不做过多介绍，重点介绍一下最后两个参数 *stride* 和 *offset*。*stride* 可以理解为每个顶点的属性占有的字节数，我们假设每个数据占的字节大小为 *FSIZE*，比如我们定义的 *verticesSizes* 中每个顶点有坐标位置及大小两个属性，而在这里 *stride* 则是这个顶点的坐标和大小两个属性所占的字节数，即 *FSIZE * 3*；*offset* 是属性的偏移量，比如顶点的大小的偏移量就是 *FSIZE * 2*：

![vertices-sizes](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-variable-insert/vertices-sizes.png)

我们可以通过 *verticesSizes.BYTES_PER_ELEMENT* 获取到 *Float32Array* 中每个元素所占的字节数，到此我们之前设置顶点坐标数据缓冲区和顶点大小数据缓冲区的 *vertexAttribPointer* 就可以改造为：

```js
// 顶点坐标
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0);
// 顶点大小
gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
```

这样就可以通过一个 *Float32Array* 对象传入两种我们需要的属性值。同理还可以传入顶点颜色，在之前的文章中说过 *attribute* 变量只能在定点着色器中使用，所以我们无法在片元着色器中定义一个 *attribute* 变量接收颜色的值。之前我们使用过 *uniform* 变量将颜色信息传入片元着色器，然而 *uniform* 变量是不变的，所以我们无法为每个顶点都准备一个值，所以之前我们的顶点颜色是一样的。在此就要隆重介绍一下我们的新角色闪亮登场：*varying*，它的作用就是从顶点着色器向片元着色器传输数据🎉

先在顶点着色器和片元着色器中定义 *varying* 变量：

```js
const VertexShader = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_Color;
    void main() {
    gl_Position = a_Position;
    v_Color = a_Color;
  }
`;
const FragmentShader = `
  precision lowp float;
  varying vec4 v_Color;
  void main() {
      gl_FragColor = v_Color;
  }
`;
```

> 如果浏览器报出：No precision specified for (float) 的错误提示，那么需要加上 precision lowp float，此语句是将精度定义为低精度。

下面的步骤就是向顶点着色器中的 *attribute* 变量 *a_Color* 传值了，在此不再赘述，与之前向缓冲区对象中传入数据的步骤相同。我将三个点分别设置为红、黄、蓝，在浏览器中的展示效果如图🤩

![gradient-triangle](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-variable-insert/gradient-triangle.png)

这种效果有没有出乎你意料呢🙊我明明就指定了3个顶点的颜色，为什么会出现这种渐变的效果呢？并且我们没有任何步骤将顶点着色器和片元着色器中的 *varying* 变量建立任何联系啊！？别急，让我来给你慢慢解释。

## 📠着色器中传递变量

首先，片元着色器接收 *varying* 变量很简单，只需要在片元着色器中也声明一个与顶点着色器中 *varying* 变量同名的变量即可。在WebGL中，如果顶点着色器与片元着色器中有类型和命名都相同的 *varying* 变量，那么顶点着色器赋给该变量的值就会自动地传入片元着色器中。

![varying-variable](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-variable-insert/varying-variable.jpeg)

## 📐几何图形的装配

我们给 *gl_Position* 指明了3个顶点，但是谁来确定这三个点就是三角形的三个顶点呢？最终，为了填充三角形内部，谁来确定哪些像素需要被着色呢？谁来负责调用片元着色器，片元着色器又是怎么处理每个片元的呢？请看下图：

![shape-compose](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-variable-insert/shape-compose.png)

**图形装配** 一步是将孤立的顶点装配成几何图形，几何图形的类别由 *gl.drawArrays* 的第一个参数决定；光栅化则是将装配好的几何图形转化为片元；转化之后的片元就会传给片元着色器， *gl_Position* 实际上是图形装配阶段的数据输入💻

> 因为被装配出的基本图形（点、线、面）又被称为图元，故 **几何图形装配** 又被称为 **图元装配过程**。

我们在这个程序中 *gl.drawArrays* 的参数n为3，所以顶点着色器被执行了3次，每一次都会遵循以下步骤：

* 第1步：执行顶点着色器，缓冲区对象中第一个坐标被传递给 *attribute* 变量 *a_Position* 。一旦一个顶点的坐标被赋值给了 *gl_Position*，它就进入了图形装配区域，并将暂时储存在那里。我们只显式地给 *a_Position* 赋值了x和y分量的值，所以z和w分量会被默认赋值为0.0和1.0。之后将其余顶点信息也按照这种方式传入并储存在装配区。
* 第2步：开始装配图形。使用传入的坐标，根据 *gl.drawArrays* 的第一个参数信息来决定如何装配。上面我们使用了 *gl.TRIANGLES* 装配出一个三角形。
* 第3步：显示在屏幕上的三角形是由片元（像素）组成的，所以还需要将图形转化为片元，这个过程被称为 **光栅化**。光栅化之后，我们就得到了组成这个三角形的所有片元。
* 第4步：一旦光栅化过程结束后，程序就开始逐个片元调用片元着色器。每一次调用就处理一个片元，对于每个片元，片元着色器计算出该片元的颜色，并写入颜色缓冲区。直到最后一个片元被处理完成，浏览器就会显示出最终的结果。

## ⎀varying 变量的内插过程

上面我们说到顶点着色器中的 *varying* 变量被传递给了片元着色器中同名、同类型的 *varying* 变量，其实这种说法并不太准确。实际上顶点着色器中的 *v_Color* 变量在传入片元着色器之前经历了内插过程。所以，片元着色器中的 *v_Color* 变量和顶点着色器中的 *v_Color* 变量并不是一回事。

我们可以思考一条两个端点颜色不同的线段，一个端点为红色 *(1.0, 0.0, 0.0)*，另一个端点为绿色 *(0.0, 1.0, 0.0)*（红配绿，时尚时尚最时尚😏）。我们在顶点着色器中向 *varying* 变量 *v_Color* 赋上两个颜色，那么WebGL就会自动地计算出线段上的所有点（片元）的颜色，并赋值给片元着色器中的 *varying* 变量 *v_Color*。

![gradient-line](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-variable-insert/gradient-line.png)

R值从1.0降到0.0，G值则从0.0上升到1.0，线段上的所有片元的颜色值都会被恰当的算出来——这个过程就是 **内插过程**。

## 结束语

预告下篇文章会介绍如何给“女神”穿新衣👘

有趣的 *varying* 变量内插过程就介绍到这里啦，后续会出更多好玩并且有用的文章分享给大家，感谢阅读~

发表于2020-04-24
