# WebGL GLSL ES语法基础

GLSL ES编程语言是在OpenGL的着色器语言（GLSL）的基础上，删除和简化一部分功能后形成的。各位看到ES版本应该会想到GLSL ES应用在手机、游戏主机等设备上，这样可以降低硬件的功耗，同时也能减少性能开销。

说了这么久的WebGL，也该提一下他的主人Khronos了：

![khronos](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-glsl-es-basic-grammer/khronos.png)

Khronos是一个专注于指定开放标准的行业协会，重点指定免费的API，使在各种平台和设备上创作或播放的多媒体可以得到硬件加速。大名鼎鼎的OpenGL、OpenGL ES、WebGL都是由该组织指定的标准，了解更多可见官网：[https://www.khronos.org/](https://www.khronos.org/)。

## ⌨️语法

### 🧩基础

* [1] GLSL ES对大小写是敏感的，例如：Niuniu和niuniu这就对应的是两个不同的变量；
* [2] 每条语句都要有;结束，有些小伙伴写JavaScript会习惯于不在语句末尾加分号，但是在GLSL ES中可要注意咯；
* [3] 每个着色器程序都要有main()函数，就像C语言一样，每个着色器程序都从main开始执行，但是GLSL ES中的main()函数并不接收任何参数，并且必须是void类型；
* [4] 单行注释使用//，多行注释则是/* 注释 */；
* [5] GLSL ES支持两种数据值类型：
* [5.1] 数值类型：GLSL ES支持整数类型和浮点数，没有小数点的值被认定为整数类型，而有小数点的则被认为是浮点数；
* [5.2] 布尔值类型：true和false，无需多言。

```glsl
// 下面是两个不同的变量
uniform mat4 u_ModelMatrix;
uniform mat4 u_modelMatrix;

/*
    多行注释
    main()函数不接收参数
*/
void main() {
  // 着色器程序代码
  // ...
}
```

### 🧙‍♂️变量

* [1] 变量名规则与其他语言基本一致：只能由a-z、A-Z、0-9以及_组成，并且变量名的第一个字符不能为数字；
* [2] 不能以gl_、webgl_或_webgl开头，这些前缀已被OpenGL ES保留了。

GLSL ES的关键字：
|  |  |  |  |
| :- | :- | :- | :- |
| attribute | bool | break | bvec2 |
| bvec3 | bvec4 | const | continue |
| else | false | float | for |
| in | inout | int | invariant |
| ivec2 | ivec3 | ivec4 | lowp |
| mat2 | mat3 | mat4 | meduimp |
| out | precision | return | sampler2D |
| samplerCube | struct | true | uniform |
| varying | vec2 | vec3 | vec4 |
| void | while | discard |  |

GLSL ES的保留字（供未来版本的GLSL ES使用）：

|  |  |  |  |
| :- | :- | :- | :- |
| asm | cast | class | default |
| double | dvec2 | dvec3 | dvec4 |
| enum | extern | external | fixed |
| flat | fvec2 | fvec3 | fvec4 |
| goto | half | hvec2 | hvec3 |
| hvec4 | inline | input | interface |
| long | namespace | noinline | output |
| packed | public | sampler1D | sampler1DShadow |
| sampler2DRect | sampler2DRectShadow | smpler2DShadow | smpler3D |
| sampler3DRect | short | sizeof | static |
| superp | switch | template | this |
| typedef | union | unsigned | using |
| volatile |  |  |  |

### ♻️基本类型与类型转换

```glsl
float fnumber = 1.1;    // 浮点数
int inumber = 1;    // 整型
bool blogic = true;    // 布尔型

// 强制类型转换
int fresult = int(fnumber);    // 去掉小数部分，例如：3.14转换为3
bool bresult = int(blogic);    // true转为1，false转为0

int iresult = float(inumber);    // 整型转换为浮点数，例如：3转换为3.0
bresult = float(blogic);    // 布尔型转换为浮点数，true转为1.0，false转为0.0

iresult = bool(inumber);    // 整型转换为布尔型，0转为false，其余非0数转为true
fresult = bool(fnumber);    // 整型转换为布尔型，0.0转为false，其余非0.0数转为true
```

### 🔴矢量和矩阵

矢量和矩阵类型：

| 类别 | GLSL ES数据类型 | 描述 |
| :- | :- | :- |
| 矢量 | vec2/vec3/vec4 | 具有2、3、4个浮点数元素的矢量 |
|  | ivec2/ivec3/ivec4 | 具有2、3、4个整型数元素的矢量 |
|  | bvec2/bvec3/bvec4 | 具有2、3、4个布尔型元素的矢量 |
|  | mat2/mat3/mat4 | 2x2、3x3、4x4的浮点数元素矩阵 |

![vector](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-glsl-es-basic-grammer/vector.png)

#### 矢量构造函数

```glsl
vec3 v3 = vec3(1.0, 0.0, 0.5);    // 将矢量v3设为(1.0, 0.0, 0.5)
vec2 v2 = vec2(v3);    // 使用v3的前两个值，将v2设为(1.0, 0.0)
vec4 v4 = vec4(1.0);    // 将v4设为(1.0, 1.0, 1.0, 1.0)

// 也可以使用多个矢量组合成一个矢量，例如：
vec4 v4_2 = vec4(v2, v4);    // 将v4_2设为(1.0, 0.0, 1.0, 1.0)，如果v2没有填满就继续用第二个参数v4中的元素填充
```

#### 矩阵构造函数

##### 方式一

矩阵构造函数的使用方式与矢量构函数的使用方式很类似，但是要保证存储在矩阵中的元素是按照 **列主序** 排列的！

```glsl
mat4 m4 = mat4(1.0, 2.0, 3.0, 4.0,
              5.0, 6.0, 7.0, 8.0,
              9.0, 10.0, 11.0, 12.0,
              13.0, 14.0, 15.0, 16.0);
```

上面构造的 *4 x 4* 矩阵对应的其实是：

![4x4-matrix](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-glsl-es-basic-grammer/4x4-matrix.png)

##### 方式二

也可以向矩阵构造函数中传入一个或多个矢量，按照列主序使用矢量里的元素值来构造矩阵：

```glsl
vec2 v2_1 = vec2(1.0, 3.0);
vec2 v2_2 = vec2(2.0, 4.0);
mat2 m2_1 = mat2(v2_1, v2_2);
// ┌1.0 2.0┐
// └3.0 4.0┘

vec4 v4 = vec4(1.0, 3.0, 2.0, 4.0);
mat2 m2_2 = mat2(v4);
// ┌1.0 2.0┐
// └3.0 4.0┘
```

##### 方式三

当然使用浮点数和矢量组合的方式来构造矩阵也是可以的：

```glsl
vec2 v2 = vec2(2.0, 4.0);
mat2 m2 = mat2(1.0, 3.0, v2);
// ┌1.0 2.0┐
// └3.0 4.0┘
```

##### 方式四

如果想构造单位矩阵，那么有更简单的方式：

```glsl
mat3 m3 = mat3(1.0);
// ┌1.0 0.0 0.0┐
// |0.0 1.0 0.0|
// └0.0 0.0 1.0┘
```

#### 访问矢量和矩阵的元素

##### 访问矢量元素

由于矢量可以存储顶点坐标、颜色和纹理坐标，所以在GLSL ES中为了增强可读性，有了分量名的概念：

| 类别 | 描述 |
| :- | :- |
| x/y/z/w | 用来获取顶点坐标分量 |
| r/g/b/a | 用来获取颜色分量 |
| s/t/p/q | 用来获取纹理坐标分量 |

可以直接通过以下方式获取：

```glsl
vec4 v4 = vec4(1.0, 1.0, 1.0, 0.0);

// v4.x;
// v4.y;
// v4.r;
```

其实，任何矢量的x、r或s都是返回第一个分量值，同理y/g/t返回第二个分量。我们还可以通过下面的方式给其他矢量赋值：

```glsl
vec4 v4 = vec4(0.0, 1.0, 1.0, 0.5);

vec2 v2 = v4.xy;
vec3 v3 = v4.yzw;
```

上面的代码中，将同一个集合的多个分量名共同置于点运算符后，就可以从矢量中同时提取出多个分量，这个过程也称作混合。当然，聚合分量名也可以作为 *赋值表达式的左值*：

```glsl
vec4 position;
position.xw = vec2(1.0, 2.0);
```

##### 访问矩阵元素

```glsl
mat4 m4 = mat4(1.0, 2.0, 3.0, 4.0,
              5.0, 6.0, 7.0, 8.0,
              9.0, 10.0, 11.0, 12.0,
              13.0, 14.0, 15.0, 16.0);
```

访问矩阵中元素可以像我们JS中访问二维数组一样：m4[0][0]，这就获取到了m4中的第一个元素1.0，在前面的介绍中有提到，可以使用矢量创建矩阵，当然我们也可以在矩阵中获取矢量：

```glsl
vec4 v4 = m4[0];    // (1.0, 2.0, 3.0, 4.0)
```

同样可以使用点操作符获取分量值：

```glsl
float m1_2 = m4[0].x;    // 将m1_2设置为m4第1列的第1个元素
m1_2 = m4[0][1];    // 将m1_2设置为m4第1列的第2个元素
```

#### 运算

##### 矢量运算

```glsl
vec2 v2_1 = (1.0, 2.0);
vec2 v2_2 = (0.1, 0.2);
float f = 0.5;

// 加法
v2_1 = v2_1 + v2_2;    // (1.1, 2.2) → (v2_1.x + v2_2.x, v2_1.y + v2_2.y)
v2_1 = v2_1 + f;    // (1.6, 2.7) → (v2_1.x + f, v2_1.y + f)
```

##### 矩阵运算

```glsl
mat2 m2_1, m2_2;
vec2 v2;
float f;

// 加法
m2_1 + f; // m2_1[0].x + f; m2_1[0].y + f; m2_1[1].x + f; m2_1[1].y + f;

// 矩阵右乘矢量
vec2 v2_result = m2_1 * v2;    // v2_result.x = m2_1[0].x * v2.x + m2_1[1].x * v2.y;
                               // v2_result.y = m2_1[0].y * v2.x + m2_1[1].y * v2.y;

// 矩阵左乘矢量
v2_result = v2 * m2_1;    // v2_result.x = v2.x * m2_1[0].x + v2.y * m2_1[0].y;
                          // v2_result.y = v2.x * m2_1[1].x + v2.y * m2_1[1].y;

// 矩阵相乘
mat2 m2_result = m2_1 * m2_2;    // m2_result[0].x = m2_1[0].x * m2_2[0].x + m2_1[1].x * m2_2[0].y;
                                 // m2_result[1].x = m2_1[0].x * m2_2[1].x + m2_1[1].x * m2_2[1].y;
                                 // m2_result[0].y = m2_1[0].y * m2_2[0].x + m2_1[1].y * m2_2[0].y;
                                 // m2_result[1].y = m2_1[0].y * m2_2[1].x + m2_1[1].y * m2_2[1].y;
```

### 🏗结构体

在GLSL ES中可以使用struct关键字定义结构体：

```glsl
// 定义结构体
struct light {
  vec4 color;
  vec3 position;
}

// 声明light类型变量
light light_1;

// 也可以使用这种方式定义并声明一个结构体类型的变量
struct light {
  vec4 color;
  vec3 position;
} light_1;
```

结构体具有标准的构造函数，其名称与结构体名一致。构造函数的参数的顺序必须与结构体定义中的成员顺序一致：*light_1 = light(vec4(0.0, 1.0, 1.0, 0.5), vec3(1.0, 0.5, 0.0));*。并且可以通过点操作符访问成员：*vec4 color = light_1.color;*。

### 🧪取样器

GLSL ES有一种内置类型称作取样器(sampler)，我们必须通过此类型变量访问纹理，并且取样器变量只能是 *uniform* 变量。取样器有两种基本类型：*sampler2D* 和 *samplerCube*，如：

```glsl
uniform sampler2D u_Sampler;
```

并且，唯一能给取样器变量赋值的就是纹理单元编号，并且必须使用WebGL提供的方法 *gl.uniform1i()* 来赋值，比如在之前的文章中我们使用 *gl.uniform1i(u_Sampler, 0)* 将纹理单元编号0传给着色器。

## 🔚结束语

本次主要总结了一下GLSL ES的基本变量类型以及基础语法，对于流程控制、条件语句等没有讲解，与 *for/if else* 使用方式一致，顺便提一点：在 *for* 循环中除了 *break和continue* 外多出一个 *discard*，*discard* 只能在片元着色器中使用，目的是放弃对当前片元的处理。

GLSL ES语法基础就介绍到这里啦，后续会出更多好玩并且有用的文章分享给大家，感谢阅读🔚

发表于2020-05-21
