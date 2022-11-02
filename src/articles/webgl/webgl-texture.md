# WebGL 纹理映射

快乐的五一假期已经过去了，大家过的如何？在山东老家，我经历了从38度到22度的过山车似的降温；也吃了好些心心念的美食，如甏肉、鱼头泡饼、糁汤、风味茄子（狗头保命）；也和好友度过愉快的时光🙊

闲言少叙，下面进入正题，本文将介绍如何给几何图形穿上漂亮的“衣服”（以后我会少开车，做一个纯洁的人）👗

## 前言

在WebGL中有一项很重要的技术 —— 纹理映射。说白了，所谓纹理映射就是将一张图片映射到一个几何图形的表面上去（就像孩童时喜欢在胳膊、手背上贴贴纸一样）😁将“贴纸”贴到一个矩形上之后，这个矩形表面看上去就像是一张图片，而此时，这张图片又可以称为纹理图像或纹理。

纹理映射的作用，就是根据纹理图像为之前光栅化后的每个片元涂上适当的颜色，组成纹理图像的像素又被称为纹素，每一个纹素的颜色都使用RGB或RGBA格式编码。如图：

![pixel](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-texture/pixel.png)

图中的每个小方块都是一个纹素（图片来源）。

## 纹理映射

![xiaopin](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-texture/xiaopin.jpeg)

问：在WebGL中进行纹理映射，分为几步？

答：4步。

### 第一步 - 准备纹理图像

天才第一步，雀…

![pia](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-texture/pia.jpeg)

作为一名龙珠的爱好者，在此我就准备了一张悟空的图片（图片来源）：

![super-saiyan](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-texture/super-saiyan.png)

### 第二步 - 为几何图形配置映射方式

指定映射方式就是确定“几何图形的某个片元”的颜色如何决定。我们利用图形的顶点坐标来确定屏幕上哪部分被纹理图像覆盖，使用纹理坐标来确定纹理图像的哪部分将覆盖到几何图形上。纹理坐标是一套新的坐标系统，下面将会对纹理坐标进行简单的介绍。

#### 纹理坐标

纹理坐标是纹理图像上的坐标，通过纹理坐标可以在纹理图像上获取纹素颜色。WebGL系统中的纹理坐标系统是二维的，为了将纹理坐标和我们平时使用的坐标系统区分开来，WebGL中使用s和t命名纹理坐标系统（st坐标系统），无图言Dior：

![texture-coordinate](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-texture/texture-coordinate.png)

如图，在纹理坐标系中，纹理图像的左下角为 *(0.0, 0.0)*，右上角为 *(1.0, 1.0)*。不要与WebGL的坐标系统搞混哦！

#### 将纹理映射到几何图形

来看看这张图：

![texture-coordinate-map](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-texture/texture-coordinate-map.png)

这张图是将纹理图像的顶点映射到WebGL坐标系统中的四个顶点处，有小伙伴可能会想到“将这个长方形的图片映射到一个正方形的区域，图片岂不是会变形”，要注意在WebGL坐标系统中我们使用的 *(0.5, 0.5, 0.0)* 这种坐标是一个相对的坐标值，如果我们的canvas是个正方形，那么上图中对应的映射区域就是个正方形，如果是长方形，同理映射区域就是个长方形。下面来看看我们的着色器如何编写：

```glsl
// 顶点着色器
attribute vec4 a_Position;
attribute vec2 a_TexCoord;
varying vec2 v_TexCoord;

void main() {
  gl_Position = a_Position;
  v_TexCoord = a_TexCoord;
}
```

顶点着色器中多声明了一个 *vec2* 变量，用来接收纹理图像的坐标，而在片元着色器会在稍后介绍。再修改一下 *initVertexBuffers* 方法：

```js
function initVertexBuffers (gl) {
  const verticesTexCoords = new Float32Array([
    // 顶点坐标    纹理坐标
    -0.5, 0.5,    0.0, 1.0, 
    -0.5, -0.5,   0.0, 0.0,
    0.5, 0.5,     1.0, 1.0,
    0.5, -0.5,    1.0, 0.0,
  ]);
  const n = 4;

  // 创建缓冲区对象
  const vertexTexCoordBuffer = gl.createBuffer();

  // ...
  // 将顶点坐标写入缓冲区
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

  // ...
  // 将纹理坐标分配给a_TexCoord并开启它
  const a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');

  // ...
  return n;
}
```

上面代码在之前的文章中写过很多遍，主要是添加了纹理坐标，就不再赘述。这样就在顶点着色器中接收到了纹理坐标，并光栅化后传给片元着色器；随后，片元着色器根据片元的纹理坐标，从纹理图像中抽取出纹素颜色，赋给当前片元，并设置顶点的纹理坐标（*initVertexBuffers()*）。

### 第三步 - 加载纹理图像

加载纹理图像要使用我们的 *Image* 对象来完成：

```js
function initTexture (gl, n) {
  const texture = gl.createTexture(); // 创建纹理对象

  // 获取 u_Sampler 的存储位置（会在第四步中介绍）
  const u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  const image = new Image();

  // 注册图像加载事件响应函数
  image.onload = function () {
    loadTexture(gl, n, texture, u_Sampler, image);
  };
  image.src = '...';

  return true;
}

function loadTexture (gl, n, u_Sampler, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); //翻转纹理图像的 y 轴
  gl.activeTexture(gl.TEXTURE0); // 开启 0 号纹理单元
  gl.bindTexture(gl.TEXTURE_2D, texture); // 向 target 绑定纹理对象

  // 配置纹理参数
  gl.texParameteri(gl.TEXTRUE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // 配置纹理图像
  gl.texImage2D(gl.TEXTURE_2D, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler, 0); // 将 0 号纹理传递给着色器

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // 绘制矩形
}
```

*initTexture* 函数中应该比较好理解，下面将直接介绍 *loadTexture* 函数。首先在我们的WebGL系统中有8个纹理单元分别是 *gl.TEXTURE0* 到 *gl.TEXTURE7*，这每一个纹理单元都与 *gl.TEXTURE_2D* 相关联，而后者就是绑定纹理时的纹理目标：

![texture-unit](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-texture/texture-unit.jpeg)

当调用 *gl.createTexture* 后，WebGL系统中就会存在一个纹理对象：

![texture-unit-created](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-texture/texture-unit-created.jpeg)

#### 坐标轴翻转

*gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)* 函数是WebGL中的图像预处理函数，第一个参数是处理方式，第二个参数为处理方式的参数，详情如下表：

| 模式名称 | 描述 | 类型 |  默认值 |  可选值 | Specified in |
| :- | :- | :- | :- | :- | :- |
| gl.PACK_ALIGNMENT | Packing of pixel data into memory | GLint | 4 | 1, 2, 4, 8 | OpenGL ES 2.0 |
| gl.UNPACK_ALIGNMENT | Unpacking of pixel data from memory. | GLint | 4 | 1, 2, 4, 8 | OpenGL ES 2.0 |
| gl.UNPACK_FLIP_Y_WEBGL | 如果为true，则把图片上下对称翻转坐标轴(图片本身不变)。 | GLboolean | false | true, false | WebGL |
| gl.UNPACK_PREMULTIPLY_ ALPHA_WEBGL | Multiplies the alpha channel into the other color channels. | GLboolean | false | true, false | WebGL |
| gl. PACK_COLORSPACE_ CONVERSION_WEBGL | Default color space conversion or no color space conversion. | GLenum | gl.BROWSER_DEFAULT_WEBGL | gl.BROWSER_DEFAULT_WEBGL, gl.NONE | WebGL |

WebGL中的纹理坐标系统的t轴方向与PNG/BMP/JPG等格式图片的坐标系统的y轴方向是相反的。所以只有先将图像的y轴进行反转，才能将图像正确地映射到图形上：

![axis-reverse](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-texture/axis-reverse.png)

#### 激活纹理单元

WebGL通过一种叫做纹理单元的机制来同时使用多个纹理。每个纹理单元有一个单元编号来管理一张纹理图像，一些其他系统支持的个数更多。内置变量 *gl.TEXTURE0* 到 *gl.TEXTURE7* 各代表一个纹理单元。

在使用纹理单元之前，需要调用 *gl.activeTexture(gl.TEXTURE0)* 来激活它（下图中激活的是 *TEXTURE0*）：

![texture-unit-active](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-texture/texture-unit-active.jpeg)

#### 绑定纹理对象

接下来，我们还要告诉WebGL系统纹理对象使用的是哪种类型的纹理。在对纹理对象操作之前，我们需要绑定纹理对象，这里会发现这一系列的操作和缓冲区很相似：在对缓冲区对象进行操作之前，也需要绑定缓冲区对象。WebGL支持两种类型的纹理：*gl.TEXTURE_2D和gl.TEXTURE_CUBE_MAP*，分别为二维纹理和立方体纹理。当调用 *gl.bindTexture* 后：

![texture-unit-bind](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-texture/texture-unit-bind.jpeg)

这样我们就指定了纹理对象的类型（*gl.TEXTURE_2D*）。

#### 配置纹理对象参数

配置纹理对象的参数的目标主要是设置：如何根据纹理坐标获取纹素颜色、以及按哪种方式重复填充纹理。对于 *gl.texParameteri()* 方法的参数含义如下图：

| pname | 描述 | 参数 |
| :- | :- | :- |
| *gl.TEXTURE_MAG_FILTER* | 纹理放大滤波器 | *gl.LINEAR(默认值),gl.NEAREST* |
| *gl.TEXTURE_MIN_FILTER* | 纹理缩小滤波器 | *gl.LINEAR,gl.NEAREST, gl.NEAREST_MIPMAP_NEAREST, gl.LINEAR_MIPMAP_NEAREST, gl.NEAREST_MIPMAP_LINEAR(默认值), gl.LINEAR_MIPMAP_LINEAR* |
| *gl.TEXTURE_WRAP_S* | 纹理坐标水平填充 s | *gl.REPEAT(默认值), gl.CLAMP_TO_EDGE, gl.MIRRORED_REPEAT* |
| *gl.TEXTURE_WRAP_T* | 纹理坐标垂直填充 t | *gl.REPEAT(默认值), gl.CLAMP_TO_EDGE, gl.MIRRORED_REPEAT* |

*gl.TEXTURE_MAG_FILTER 和 gl.TEXTURE_MIN_FILTER* 的非金字塔纹理类型常量：

| 值 | 描述 |
| :- | :- |
| *gl.NEAREST* | 使用原纹理上映射后距离像素中心最近的那个像素的颜色值，作为新像素的值。 |
| *gl.LINEAR* | 使用距离新像素中心最近的四个像素的颜色值的加权平均，作为新像素的值。（与 *gl.NEAREST* 相比，该方法图像质量更好，但是会有较大的开销。） |

可以赋值给 *gl.TEXTURE_WRAP_S 和 gl.TEXTURE_WRAP_T* 的常量（可以想象一下以往在Windows系统中设置桌面壁纸时的平铺/拉伸等选项）：

| 值 | 描述 |
| :- | :- |
| *gl.REPEAT* | 平铺式的重复纹理 |
| *gl.MIRRORED_REPEAT* | 镜像对称式的重复纹理 |
| *gl.CLAMP_TO_EDGE* | 使用纹理图像边缘值 |

![texture-parameters](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-texture/texture-parameters.png)

#### 将纹理图像分配给纹理对象

使用 *gl.texImage2D* 方法将纹理图像分配给纹理对象，同时该函数还允许告诉WebGL系统关于该图像的一些特性。此API参数比较复杂，详细了解请参考[MDN texImage2D](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D)。

![tex-image](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-texture/tex-image.jpeg)

### 第四步 - 在FS中抽取纹素并赋给片元

#### 将纹理单元传递给片元着色器

首先让我们来看一下片元着色器代码：


```glsl
// 片元着色器
#ifdef GL_ES
    precision mediump float;
#endif
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;

void main() {
  gl_FragColor = texture2D(u_Sampler, v_TexCoord);
}
```

我们在示例程序中使用了 *gl.TEXTURE_2D* 这种二维纹理，所以在片元着色器中定义的 *uniform* 变量的数据类型应该为 *sampler2D*，除此之外还有 *samplerCube*（这种数据类型对应 *gl.TEXTURE_CUBE_MAP*）。

在 *initTexture* 函数中，我们获取到了 *uniform* 变量 *u_Sampler* 的存储地址，并将其作为参数传给 *loadTexture* 函数。我们必须通过指定纹理单元编号（即 *gl.TEXTUREn* 中的n）将纹理传给 *u_Sampler*。因为我们绑定到了 *gl.TEXTURE0* 上，所以调用 *gl.uniform1i* 时，第二个参数设为0：

![tex-image-bind](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-texture/tex-image-bind.jpeg)

#### 从顶点着色器向片元着色器传输纹理坐标

我们是通过 *attribute* 变量 *a_TexCoord* 接收顶点的纹理坐标，所以将数据赋值给 *varying* 变量 *v_TexCoord* 并将纹理坐标传入片元着色器是行得通的。

剩下的工作就是，根据片元的纹理坐标，从纹理图像上抽取出纹素的颜色，然后涂到当前的片元上。

#### 在片元着色器中获取纹理像素颜色

```glsl
gl_FragColor = texture2D(u_Sampler, v_TexCoord);
```

我们使用GLSL ES内置函数 *texture2D()* 来抽取纹素颜色，该函数使用起来十分方便，只需要传入两个参数——纹理单元编号和纹理坐标，就可以获取到纹理上的像素颜色。

纹理放大和缩小方法的参数将决定WebGL系统将以何种方式内插出片元。我们将 *texture2D()* 函数的返回值赋给了 *gl_FragColor* 变量，然后片元着色器就将当前片元涂成这个颜色。最后，纹理图像就被映射到了图形上，并最终被画了出来。

下面让我们打开页面看一下效果（因为跨域原因，大家需在本地启用http服务器）：

![black-tex-image](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-texture/black-tex-image.png)

怎么漆黑一片呢？怎么肥四？

![why](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-texture/why.jpeg)

别急，先来仔细看一下console信息：

![console](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-texture/console.png)

会发现warning中有说到我们的纹理图像无法渲染，可能因为图片尺寸不是2的整数次方，那么让我们把图片裁剪成 *256 x 256* 大小的再试一下呢？

![result](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-texture/result.png)

完美🤩我们目前使用的都是WebGL1 .0的特性，在WebGL 2.0中支持了非2的整数次方大小的纹理图像！

我们已经成功展示出一张图片了，但是在WebGL系统中有多个纹理单元，所以我们可以展示多张图片，比如我给悟空图片上再加一张图片：

![composed-result](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-texture/composed-result.png)

这里就不详细描述了，给一点提示：片元着色器中 *texture2D* 内置函数返回的是 *vec4* 类型的 color，而对于两张图片的重叠部分：

```glsl
gl_FragColor = color0 * color1;
```

可以通过以上方式计算得出！

## 结束语

纹理部分内容较多，大家可以慢慢学习一下，再次总结一下主要分为四步：

* [1] 准备纹理图像；
* [2] 为几何图形配置映射方式；
* [3] 加载纹理图像：
* [3.1] 翻转坐标轴（*gl.pixelStorei*）；
* [3.2] 激活纹理单元（*gl.activeTexture*）；
* [3.3] 绑定纹理对象（*gl.bindTexture*）；
* [3.4] 配置纹理参数（*gl.texParameteri*）；
* [3.5] 配置纹理图像（*gl.texImage2D*）；
* [3.6] 将纹理单元传给着色器。
* [4] 在FS中抽取纹素并赋给片元（*texture2D*）。

每次写文章都要画这么多图（手动捂脸），心累～

![images-list](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-texture/images-list.png)

![ps-layers](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-texture/ps-layers.png)

有趣的纹理映射就介绍到这里啦，后续会出更多好玩并且有用的文章分享给大家，感谢阅读~

发表于2020-05-07
