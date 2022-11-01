# 客官，进来看看图形的几何变换？

## 齐次坐标

### 简介

说到图形的几何变换，就离不开 *“齐次坐标”* 这个神奇的东西，所谓“齐次坐标”，就是将一个原本 *n* 维的向量用一个 *n+1* 维的向量来表示。比如向量：

![vector](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform/vector.png)

的齐次坐标可表示为：

![homogeneous-vector](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform/homogeneous-vector.png)

其中 *h* 是一个实数。显然一个向量的齐次坐标的表示是不唯一的，齐次坐标中的 *h* 取不同的值都表示的是同一个点，例如齐次坐标 *[8, 4, 2], [4, 2, 1]* 表示的都是二维点 *(4, 2)*。

### 优势

* [1] “齐次坐标”提供了用矩阵运算把二维、三维甚至更高维空间中的一个点集从一个坐标变换到另一个坐标系的有效方法；
* [2] 其次还可以表示无穷远的点，*n+1* 维的“齐次坐标”中如果 *h=0*，实际上就表示了 *n* 维空间的一个无穷远的点。对于“齐次坐标” *[a, b, h]*，保持 *a* 和 *b* 不变，*h → 0* 的过程就表示了二维坐标系中的一个点沿着直线 *ax + by = 0* 逐渐走向无穷远处的过程。

> 解释一下：在笛卡尔坐标中无穷远处的点表示为 *(∞, ∞)*，而一个实数除以 *0* 是趋向于 *∞* 的，所以在“齐次坐标”中 *(1/h, 2/h, h )* 当 *h → 0* 时，齐次坐标表示的点也趋向于无穷。

## 二维图形的几何变换

图形的几何变换主要包括：平移、缩放、旋转三种最基本的变换形式；其中有比较特殊的如对称变换、错切变换、复合变换等。下面将会对以上的变换方式进行逐一的介绍。

在介绍之前要先说一下“二维齐次坐标变换”的矩阵形式：

![matrix](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform/matrix.png)

将矩阵分为4部分，第一部分 *[a, b, d, e]* 可以控制图形的缩放、旋转、对称和错切的变换；*[c, f]* 是对图形进行平移变换；*[g, h]* 是对图形作投影变换；*[i]* 则是控制图形整体的缩放变换。

> 以下几何变换都会采用齐次坐标进行运算。

### 平移变换

平移变换是将坐标的 *[x, y]* 进行加法运算，平移由 *[c, f]* 进行控制：

![translate](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform/translate.png)

如图：

![translate-showcase](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform/translate-showcase.png)

### 缩放变换

缩放变换是对坐标进行一定比例的缩放，由 [a, b, d, e] 控制：

![scale](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform/scale.png)

如图：

![scale-showcase](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform/scale-showcase.png)

### 旋转变换

在直角坐标平面中，将二维图形绕原点旋转 *θ* 角的变换形式如下：

![rotate](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform/rotate.png)

如图：

![rotate-showcase](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform/rotate-showcase.png)

首先描述一下上图中的情境，三角形绕原点逆时针由 *β* 角又旋转了 *θ*。

下面，我将会给大家证明一下绕原点旋转 *θ* 角的矩阵形式（规定：逆时针旋转 *θ* 取正值，顺时针旋转 *θ* 取负值），只证明一个点即可，其余两个点同理：

![rotate-calculation](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform/rotate-calculation.png)

还是有点怀疑？那我们来验证一下，既然顶点都是围绕着原点进行旋转，那么也就表示顶点的运动轨迹是一个以原点 *(0, 0)* 为圆心，以 *r* 为半径的圆形，那么我们旋转前后，距离原点的距离应该是一样的：

![rotate-calculation-result](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform/rotate-calculation-result.png)

可以看出，旋转前后距离原点的距离是没有改变的！

## 三维图形的几何变换

对于三维图形的几何变换来说，与二维图形基本一致，只不过在三维图形的世界中多了 *z* 轴，也正是 *z* 的存在才使得三维世界中的图形有了远近、透视等表现。三维图形的变换矩阵就会变成：

![3d-matrix](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform/3d-matrix.png)

其中，左上角的部分负责产生缩放、旋转和错切等几何变换；右上角的 *[a_14, a_24, a_34]* 产生平移变换；左下角的 *[a_41, a_42, a_43]* 产生投影变换，而最后部分的 *[a_44]* 会产生整体的缩放变换。三维图形的平移变换与二维图形一致在此不再赘述，下面我们说一下缩放变换、绕坐标轴的旋转变换以及复合变换。

### 缩放变换

假设有参考点：

![reference-point](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform/reference-point.png)

我们要对其进行缩放变换，那么步骤如下：

* [1] 将参考点平移到坐标原点；
* [2] 进行缩放变换；
* [3] 将参考点移回原位置。

则变换矩阵为：

![3d-scale](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform/3d-scale.png)

要注意哦，计算变换矩阵是 ***从右向左乘***！

### 绕坐标轴的旋转变换

三维坐标空间的旋转相对要复杂一些，考虑右手坐标系下相对坐标原点绕坐标轴旋转 *θ* 角的变换。

* [1] 绕x轴旋转：

![3d-rotate-by-x](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform/3d-rotate-by-x.png)

* [2] 绕y轴旋转：

![3d-rotate-by-y](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform/3d-rotate-by-y.png)

* [3] 绕z轴旋转：

![3d-rotate-by-z](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform/3d-rotate-by-z.png)

### 复合变换

设旋转轴AB由任意一点

![3d-compose-transform-point](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform/3d-compose-transform-point.png)

及其方向数 *(a, b, c)* 定义，空间一点

![3d-compose-transform-point-a](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform/3d-compose-transform-point-a.png)

绕AB轴旋转 *θ* 角到点

![3d-compose-transform-point-b](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform/3d-compose-transform-point-b.png)

则：

![3d-compose-transform-result](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform/3d-compose-transform-result.png)

可以通过下列步骤来实现P点的旋转：

* [1] 将A点移动到坐标原点；
* [2] 使AB分别绕x轴、y轴旋转适当的角度与z轴重合；
* [3] 将AB绕z轴旋转θ角；
* [4] 作上述操作的你操作，使AB回到原来的位置。

![3d-compose-transform-recover](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-transform/3d-compose-transform-recover.png)

> 三维图形变换的示意图画起来比较复杂，偷个懒就靠大家自行脑补一下😬在Markdown中写矩阵的数学表达式写的有点烦躁~
> 由于文章是在公众号改名前写的，故图片水印还是公众号原名“非猿”，大家请忽略！

## 结束语

有趣的图形变换就介绍到这里啦，后续会出更多好玩并且有用的文章分享给大家，感谢阅读~

发表于2020-04-02
