# WebGL 光照

## 📖前言

上篇文章我们绘制了第一个立方体，色彩十(花)分(里)绚(胡)丽(哨)😜但是如果我们把立方体的各个面换成朴素的白色呢？就会呈现出下图的效果：

![white-cube](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-light/white-cube.png)

可是在我们现实生活中，一个纯白色的立方体出现在我们面前的时候却不是这个效果，即使是纯白色，但是我们也能很清晰的看清立方体的棱角，以及明暗面！这就体现了光照的重要性，光照可以让我们的WebGL世界更加真实😉

## 🔆光

光在我们的生活中起着至关重要的作用，作物生长、人类生产都离不开光。太阳为我们提供了所需的光芒，而太阳神阿波罗是众神之神宙斯的孩子这一身份也说明了光的重要性。

> 阿波罗常被现代人说成是太阳神，而事实上，公元前5世纪已经将他赫利俄斯等希腊土著文明所信奉的太阳神进行并同。在古希腊神话晚期，阿波罗已经有太阳神属性🔥

*神说：”要有光。“就有了光。*（引自《圣经》）：

![sunshine-light](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-light/sunshine-light.png)

于是就给我们的白色立方体加了缕缕阳光，”夕阳从来都不说话却也温暖了晚霞“，”夕阳“照在白色的物体上也变得温暖了，这种结果也是符合我们生活常识的。至于如何给我们的WebGL世界添加光照先卖个关子，在添加光照之前各位先思考下面两个问题：

* [1] 我们生活中光的来源有太阳，还有灯、火焰等，那么光源都有什么类型呢？
* [2] 物体呈现的颜色与反射的光的颜色有关（所以黑洞来者不拒就是个”黑窟窿“），那么物体如何反射光线呢？

### 光源类型

有光就会有光源，在我们的日常生活中常见的光源类型主要有两种：***平行光和点光源***。像我们自然中的太阳光就属于平行光；点光源则包含灯泡发出的光之类的。此外还有环境光，环境光是来模拟真实世界中的非直射光的，也就是由光源触发后经过墙面或者其他物体反射后的光。

![light-types](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-light/light-types.png)

**平行光**：顾名思义，平行光的光线是相互平行的，平行光具有方向。平行光可以看做是无限远处的光源发出的光。因为太阳距离地球很远，所以阳光到达地球时可以认为是平行的，平行光的定义很简单，只需要有一个方向和一个颜色即可。

**点光源**：点光源是从一个点向周围所有的方向发出的光。点光源光可以用来表示现实生活中的灯泡、火焰等。我们需要指定点光源的位置和颜色。光线的方向将根据点光源的位置和被照射的部位计算出来，因为点光源光在场景内的不同位置是不同的。

**环境光**：是指那些经光源（点光源或平行光）发出后，被墙壁等物体反射多次，然后照到物体表面上的光。环境光从各个角度照射物体，其强度都是相同的。

### 反射类型

物体向哪个方向反射光以及反射光的颜色，主要取决于以下两个因素：入射光和物体表面的类型。入射光信息包括入射光的方向和颜色，而物体表面信息包括物体的固有颜色（也称基底色）和反射特性。物体表面反射光线的方式有两种：***漫反射和环境反射***，下面将逐个介绍。

#### 漫反射

**漫反射是针对平行光和点光源而言的。**漫反射是针对现实生活中大部分粗糙材质（比如塑料、岩石等）而建立的理想反射模型，其反射光在各个方向上是均匀的：

![reflect](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-light/reflect.png)

在漫反射中，反射光的颜色取决于入射光颜色、表面基底色、入射光与表面形成的入射角。我们将入射角定义为入射光与表面法线形成的夹角，并用θ表示，则漫反射光的颜色可以根据下面公式计算得到：

![reflect-formula](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-light/reflect-formula.png)

#### 环境反射

**环境反射是针对环境光而言的。**在环境反射中，反射光的方向可以认为就是入射光的反方向。由于环境光照射物体的方式是各个方向均匀的、强度相等的，所以反射光的各个方向也是均匀的：

![env-reflect](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-light/env-reflect.png)

而我们如何得到环境反射光的颜色呢？

![env-reflect-formula](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-light/env-reflect-formula.png)

上面的入射光颜色其实就是环境光的颜色，当漫反射和环境反射同时存在的时候，将二者相加即是物体最终被观察到的颜色：

![final-light-formula](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-light/final-light-formula.png)

### 平行光下的漫反射

根据上面的公式我们可以知道，计算平行光入射的漫反射光颜色，需要三个数据：平行入射光的颜色、表面的基底色和入射光与表面形成的入射角θ。入射光颜色和表面基底色对我们来说很容易获取，可是我们无法预先确定光线以怎样的角度照射到每个表面上。但是，我们可以确定每个表面的朝向，在指定光源的时候，再确定光的方向，就可以用这两项信息来计算出入射角了☀️

在高中的时候，我们学习过下面公式：

![vector-multiply](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-light/vector-multiply.png)

两个向量的点积等于，这两个向量的模的乘积再乘上两个向量夹脚的cos值，当向量都为单位向量时，两个向量的乘积结果就为cosθ。这就需要我们将光线方向和法线方向都调整为单位向量，同时保持方向不变，这个过程称作 **归一化（normalization）**。GLSL ES中也提供了内置的归一化函数，我们可以直接使用！

同时需要注意，光线方向其实是入射方向的反方向，即从入射点指向光源方向，因为这样的话，该方向与法线方向的夹角才是入射角的大小。

## 🏖为系统添加光照

首先将一缕暖阳照射到立方体上！

### 平行光

在顶点着色器添加变量用来接收法向量、光线颜色，以及光线方向：

```glsl
// ...
attribute vec4 a_Normal;    // 法向量
uniform vec3 u_LightColor;    // 光线颜色
uniform vec3 u_LightDirection;    // 光线方向

void main () {
  gl_Position = u_FinalMatrix * a_Position;
  // 对法向量进行归一化
  vec3 normal = normalize(vec3(a_Normal));
  // 计算光线方向与法向量的点积
  float dotResult = max(dot(u_LightDirection, normal), 0.0);
  // 计算漫反射光的颜色
  vec3 diffuse = u_LightColor * a_Color.rgb * dotResult;
  v_Color = vec4(diffuse, a_Color.a);
}
```

在计算点积时我们使用max函数避免光源在表面背面，此时cos值为负数，我们便将值设为0.0。下面在JavaScript中添加一些添加光照的代码：

```js
function main () {
  // ...

  const u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  const u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');

  // ...

  // 将光线颜色设置为黄色
  gl.uniform3f(u_LightColor, 0.8, 0.8, 0.0);
  // 光线方向（世界坐标系下）
  const lightDirection = new Vector3([0.5, 3.0, 4.0]);
  lightDirection.normalize();    // 归一化
  gl.uniform3fv(u_LightDirection, lightDirection.elements);

  // ...
}
```

*Vector* 相关的代码各位也可以使用 *antv* 中 *gl-matrix* 中的工具函数！下面我们将在 *initVertexBuffers* 函数中定义法向量：

```js
function initVertexBuffers (gl) {
  // ...

  // 法向量
  const normals = new Float32Array([
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,
    1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,
    -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,
    0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,
    0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,
  ]);

  initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT);

  // ...

  return indices.length;
}

function initArrayBuffer (gl, data, num, type, attribute) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  const a_attribute = gl.getAttribLocation(gl.program, attribute);
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);
}
```

这样就会出现文章开篇的立方体的效果😽

## 点光源

在前面的图中，大家可以发现点光源与物体表面各个地方产生夹角都不同，所以我们通过给顶点着色器传递光线方向的方法在此就行不通了。但是我们可以通过光源的所在位置，在顶点着色器中计算光线与法向量的角度😜下面开始编写着色器：

```glsl
// ...
uniform mat4 u_ModelMatrix;
uniform vec3 u_LightPosition;

void main () {
  gl_Position = u_FinalMatrix * a_Position;
  vec3 normal = normalize(vec3(a_Normal));
  // 计算顶点的世界坐标
  vec4 vertexPosition = u_ModelMatrix * a_Position;
  // 计算光线方向并归一化
  vec3 lightDirection = normalize(u_LightPosition - vec3(vertexPosition));

  float dotResult = max(dot(lightDirection, normal), 0.0);
  vec3 diffuse = u_LightColor * a_Color.rgb * dotResult;
  v_Color = vec4(diffuse, a_Color.a);
}
```

不知道各位还记不记得模型矩阵的作用呢（了解[坐标系统和变换矩阵](https://mp.weixin.qq.com/s?__biz=MzIxMzY1OTQxOQ==&mid=2247483800&idx=1&sn=d0e1ce2f5d7dcab439e915ec0465fd6a&scene=21#wechat_redirect)）？而在JavaScript代码中，我们需要修改的就是给顶点着色器传递点光源位置数据以及模型矩阵数据：

```js
function main () {
  // ...

    const u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
  gl.uniform3f(u_LightPosition, 0.0, 3.0, 4.0);
  const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  const modelMatrix = new Matrix4();
  // 进行一系列变换...
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // ...
}
```

然后，在浏览中的显示效果就如下图所示：

![dot-light-result](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-light/dot-light-result.png)

到这里，大家有没有注意到，对于每一个面我们在顶点着色器中都只计算了四个顶点的颜色值，而对于面内部其他片元的颜色值是通过变量内插实现的（了解[变量内插](https://mp.weixin.qq.com/s?__biz=MzIxMzY1OTQxOQ==&mid=2247483757&idx=1&sn=90607e2e47e155aed67a66166e1cf8c8&scene=21#wechat_redirect)）。这种方式有时可能会造成光照效果的不自然，所以为了解决光照效果不自然的问题，我们需要逐片元的计算颜色值。只需要修改着色器程序即可。顶点着色器：

```glsl
// ...

void main () {
  gl_Position = u_FinalMatrix * a_Position;
  // 计算顶点的世界坐标
  v_Position = vec3(u_ModelMatrix * a_Position);
  v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
  v_Color = a_Color;
}
```

片元着色器：

```glsl
uniform vec3 u_LightColor;
uniform vec3 u_LightPosition;
varying vec3 v_Normal;
varying vec3 v_Position;
varying vec4 v_Color;

void main () {
  // 对发现进行归一化处理
  vec3 normal = normalize(v_Normal);
  // 计算光线方向并归一化
  vec3 lightDirection = normalize(u_LightPosition - v_Position);
  // 计算光线方向和法向量的点积
  float dotResult = max(dot(lightDirection, normal), 0.0);
  // 计算diffuse
  vec3 diffuse = u_LightColor * v_Color.rgb * dotResult;
  gl_FragColor = vec4(diffuse, v_Color.a);
}
```

最终效果如下图：

![dot-light-calculate-fragment](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-light/dot-light-calculate-fragment.png)

此处看起来没什么差别，但是当遇到光照效果不自然时，就可以考虑使用逐片元计算颜色值来解决！

### 环境光

再在顶点着色器中添加变量用来接收环境光的颜色：

```glsl
// ...
uniform vec3 u_AmbientLight;

void main () {
  // ...
  // 计算环境光
  vec3 ambient = u_AmbientLight * a_Color.rgb;

  // 将环境光与漫射光相加
  v_Color = vec4(diffuse + ambient, a_Color.a);
}
```

下面在JavaScript中向顶点着色器传入环境光数据：

```js
function main () {
  // ...

  const u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
  gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

  // ...
}
```

加上环境光之后效果如下：

![env-light-result](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-light/env-light-result.png)

因为相比之前单独的一个平行光的照射又多了环境光，所以会显得更加明亮🤗就此结束了吗？怎么可能！WebGL世界中的物体可是不安分的，我们之前讲过图形变换，当图形变换之后，照射的效果也会随之改变！

### 给不安分的物体一点阳光

我们回顾一下上面的公式：

![reflect-formula](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-light/reflect-formula.png)

我们使用单位向量来计算cosθ的值就可以转换为：

![reflect-formula-with-unit-vector](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-light/reflect-formula-with-unit-vector.png)

我们先明确一点，当物体变换的时候，入射光颜色、表面基底色以及光线方向并不会改变，所以变化只有各个平面的法向量。然后再想一想几何图形的变换都有哪几种呢？旋转、缩放和平移（了解[图形变换](https://mp.weixin.qq.com/s?__biz=MzIxMzY1OTQxOQ==&mid=2247483703&idx=1&sn=2f7471a05268864b27d96067aff0fbee&scene=21#wechat_redirect)）。这些变换操作都有哪些会对法向量造成影响呢：

![vector-transform](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-light/vector-transform.png)

最左侧是初始化的位置，蓝色箭头表示平面的法向量，从第二张图开始分别是经过平移、旋转和缩放之后的几何图形。我们可以观察到：

* [1] 平移并不会影响平面的法向量；
* [2] 旋转会改变平面的法向量；
* [3] 缩放并不会改变平面的法向量；

可真的是这样吗？大家看一下下面这张图：

![vector-scale-by-x](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-light/vector-scale-by-x.png)

我对旋转后的图形又沿着x轴使其宽度变为原来的2倍，可以明显的发现法向量发生了变化。所以上面所总结的三条中，第三条改为：缩放有可能改变平面法向量才对！那么当图形变换之后，我们如何求出平面的法向量呢？这就需要隆重介绍一下一个神奇的矩阵：逆转置矩阵！只要将变换前的法向量乘上模型矩阵的逆转置矩阵即可。当然，对于矩阵转置和求逆矩阵在 *gl-matrix* 工具函数中也都有哟：

![antv-matrix-utils](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-light/antv-matrix-utils.png)

*transpose* 函数为转置函数，*invert* 函数为转换为逆矩阵。详细代码就不贴上咯，很简单，相信大家可以自己完成👍🏻

## 🎬结束语

光照是三维世界中必不可缺的一部分，它能让三维世界更加逼真，让用户的体验更加愉悦！有趣的光照系统就介绍到这里啦，后续会出更多好玩并且有用的文章分享给大家，感谢阅读🔚

发表于2020-05-29