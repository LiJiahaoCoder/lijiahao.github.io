# WebGL 颜色与图像

## 📖前言

这两天抽时间把《计算机图形学导论》的第一章看完了，边看边惊呼：“我diu~竟然是这样”！第一章虽为概述，但内容还是要许久才能“消化”！

“独乐乐不如众乐乐”，既然内容这么哇噻，那就总结分享出来🤗

## 🎨颜色和图像

《你是我的眼》里有一句歌词是“眼前的黑不是黑，你说的白是什么白”，当初一直不理解为什么不是黑？疑惑白是什么白？直到我看了这一章才知道：眼前的黑有可能不是黑，产品口中五彩斑斓的黑... ...（提这种需求的产品应该挨一顿暴揍）🤺

首先要明确，当我们在讨论颜色时需要在两个层面上进行考量：物理层，包括光到达物体表面然后到达人眼时产生的颜色刺激所涉及的物理规则；感知层，包括人类感知到颜色刺激的机理，说白了就是主观因素（像我这个色弱看到的颜色可能和正常人会不同）🌚

下面将从这两个方面介绍一下😉

### 视觉系统

首先来聊一下视觉系统，*人类的视觉系统（HVS）* 由眼睛和大脑组成，眼睛负责捕捉光线和物理颜色刺激，大脑负责解释这些视觉刺激。

颜色刺激是一种辐射能，但是视觉系统却无法感知所有的辐射。光可以根据波长进行描述，可见光是人类视觉系统唯一能感知的辐射，波长范围是 *380nm到780nm*。

![hvs](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-color-and-image/hvs.jpeg)

辐射通过角膜进入眼睛，最后到达视网膜。视网膜上有两种光线接收器，视杆细胞和视锥细胞。视杆细胞能够探测到微弱的光，并且产生单色的信号，比如你和女神在看星星的时候，就是视杆细胞在工作。视锥细胞没有视杆细胞敏感，在白天，光线非常强以至于视杆细胞达到饱和而变得毫无功能性，此时视锥细胞开始起作用。

根据对可见光谱各波长部分敏感度的不同，视锥细胞分为三种类型：长、中、短视锥细胞。三种不同的视锥细胞产生的不同信号导致了光的三色视觉特征，因此人类是 三色视 的。三色视解释了为什么不同的颜色刺激会被认为是相同的颜色，这种结果称为 同色异谱。同色异谱可分为 光照同色异谱 和 观察者同色异谱。光照同色异谱是当光照改变的时候相同的颜色被认为是不同的，观察者同色异谱是相同的颜色刺激被不同的观察者认为是不同的颜色。

“扯了半天就想给我上一节生物课？”

“是！你能把我怎样？”

年轻人别急嘛，咱们接着说~视杆细胞和视锥细胞相互连接形成了感知区域。感知区域分为三种：黑-白、红-绿和黄-蓝，这三种感知区域称为 **对立通道**。黑-白通道是视网膜上具有最高空间分辨率信号的感知通道，这也正是为什么人眼对于图像亮度的变化比颜色变化更加敏感的原因。

上述特性便可应用于图像压缩，因为颜色信息相比于光照信息压缩程度更高。 生物课没白讲吧，还是有点用的!

### 颜色空间

由于颜色受到主/客观因素的影响，所以很难定义一个唯一的表示方法。如果将颜色仅看成是人眼系统三色视特性的结果，那么最自然的颜色描述方式是将其定义为 三原色 的组合。三原色通常有两种组合方式：*加色法* 和 *减色法*。

加色颜色模型通过三个单色的不同结合方式产生刺激。如果我们有三桶油漆颜色分为红、绿、蓝，那么我们可以通过调整不同颜色油漆的比例，从而混合得到所有的颜色。

减色颜色模型通过减小反射器上入射光的波长的方式产生刺激。最著名的应用实例是青色、品红、黄色和主（黑）色的打印模式。假设，在白色光线下在白纸上进行打印。如果不在之上喷涂任何墨水，那么纸张看上去就是白色，如果在之上喷涂青色墨水，纸看上去就是青色，因为墨水吸收了红色波。加入再加入黄色，蓝色波也将被吸收，纸看上去就是绿色。最后，如果再将品红加入，将实现墨水的结合，墨水将吸收所有的波长，纸看上去就是黑色。

基于以上原理，通过对纸上每一种主墨水或颜色的数量进行建模，就可以表示色谱上的任意颜色。那么，为什么还需要黑色墨水呢？因为墨水或者纸张都不是理想的，在实际情况下，很难得到黑色，而我们得到的只是一个很深的颜色罢了。通常，特定量的黑色用来吸收所有的光波，这一定量是颜色的三原色部分的最小值。例如，我们希望得到颜色 *(c, m, y)*，打印机将进行如下颜色组合：

![cmy](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-color-and-image/cmy.png)

### CIE XYZ

*CIE XYZ* 是于1931年由CIE国际委员会定义的标准是最重要的颜色系统之一。这个颜色标准是基于以下实验：定义一组特定的视觉条件后，实验对象被要求通过调节特定的参数来匹配两个不同的颜色。通过收集实验对象对若干单色可见光波的反应来定义人类观察者的平均反应。这些观察者称为 颜色刺激的标准观察者。标准观察者的反应通过一组函数进行编码，这些函数称为 颜色匹配函数。颜色匹配函数通常表示为：

![rgb](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-color-and-image/rgb.png)

通过将其与功率谱分布函数 *I(λ)* 进行积分，可以将颜色定义为：

![rgb-function](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-color-and-image/rgb-function.png)

![cie-rgb](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-color-and-image/cie-rgb.png)

*(a): CIE 1931 RGB 颜色匹配函数*

![cie-xyz](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-color-and-image/cie-xyz.png)

(b): CIE XYZ 颜色匹配函数

图 (b) 展示了 *CIEXYZ* 原色：

![xyz](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-color-and-image/xyz.png)

这些匹配函数是 CIERGB 颜色匹配函数的转换版本。经过转换，所有的匹配函数均为正函数，这样可以简化色彩再现设备的设计。将 CIERGB 颜色空间转换为 CIEXYZ 颜色空间的公式如下：

![rgb-transform-to-xyz-matrix](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-color-and-image/rgb-transform-to-xyz-matrix.png)

X Y Z颜色坐标的标准形式可以用来定义 色度坐标：

![xyz-coordinate](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-color-and-image/xyz-coordinate.png)

色度坐标无法完全确定一个颜色，这是由于其和总是为1。因此色度坐标仅需要利用两个坐标以二维的形式就可以确定。通常，将𝑌与𝔁和𝔂进行组合来完整定义三色空间，即𝔁𝔂𝑌。颜色坐标𝔁和𝔂通常用来可视化色度图上的颜色（即便是专业打印机也无法再现色度图上的所有颜色）：

![color-coordinate](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-color-and-image/color-coordinate.jpeg)

### HSL和HSV

图形学应用中常用的两种颜色空间是 HSL 和 HSV。在 HSL 中，颜色由 色调（Hue）、饱和度（Saturation）和 亮度（Lightness）来描述，而在 HSV 颜色系统中亮度被替换为 值（Value）。色调表示待定义颜色的基本色度，亮度（颜色的物理特征）与颜色的强度成正比，饱和度与颜色的纯度有一定关联。

就像 CIEXYZ 与 CIERGB 颜色空间的坐标可以进行转换一样，RGB 和 HSL/HSV 颜色空间之间也可以进行转换。下面给出将 RGB 颜色空间转换为 HSL 模式的方法：

![rbg-transform-to-hsl](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-color-and-image/rbg-transform-to-hsl.png)

其中 *M=maxR, G, B*，*m=minR, G, B*，*Δ=M-m*。方程中的度源于六边形定义的色调，HSV 的转换方式与 HLS 的类似，色调的计算方法相同，而饱和度和亮度的定义略有不同，具体如下：

![s-formula](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-color-and-image/s-formula.png)

![hsv-and-hsl](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-color-and-image/hsv-and-hsl.png)

*HSL和HSV颜色空间*

### 图像表示

*向量图* 和 *光栅图* 是二维图像的两种基本定义方法。向量图是一种将图像表示为一组基本绘制图元的方法，通过组合点、直线、曲线、矩形、星形以及其他形状而定义的图像；而光栅图像则是由规则放置的小颜色块构成的矩形排列。

这些小的颜色块称作 像素，像素大小是沿着图像宽和高方向的像素数量，比如下图的像素数大小为20 x 20。图像的像素数大小通常用来代替 像素分辨率，简称 分辨率。但是二者有着非常重要的区别：分辨率表示一个图像的细节可以描述到多小的程度，通常量化为图像上的两条直线在不被显示为一条直线时能够靠多近，分辨率的测量单位是每英寸像素数，即一英寸上具有的像素数。

![pixel-mario](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-color-and-image/pixel-mario.png)

根据图像的性质，可以将像素定义为 标量 或 向量。比如，灰度图像 的每一个像素是一个标量值，代表图像在这一位置的亮度；在彩色图像中，每个像素由包含若干个标量分量的向量来表明图像的相应位置的颜色。

分辨率对于区分光栅图和向量图具有重要的作用。向量图可以认为是具有无限分辨率的图像，实际上，向量图可以简单地通过施加缩放因子被放大，而不会损失其所描述图像的质量。相反，光栅图像的质量严重依赖于分辨率，利用光栅图绘制平滑的曲线需要较高的分辨率。如果分辨率较低，像素将变得可见，这种视觉效果称为 像素化。

向量在描述自然场景等复杂图像时具有一定的局限性，在这种或相似情况下，为了确保表现效果，向量图需要大量非常小的绘制粒度，而光栅图更适合表示这种图像。所以，向量图常用来设计标志、商标、个性化绘图、图标以及其他类似图像，而不适用于表示自然景观图像或者需要丰富视觉内容的图像。

## 🧮光栅图像生成算法

书中第一章介绍了两种图像的绘制模式：*光线跟踪* 和 *光栅化流水线*，下面将会简单的介绍一下。

### 光线跟踪

人类能够看到事物是因为光源发射的光子，光子是光在空间中传播的基本粒子。光子在传播过程中撞击到物体表面而改变方向，最终有一部分到达人眼。

假如希望模拟光子的传播过程，并且计算光和物体的交互以跟踪每一个光子到达眼睛的路径。很显然，多数光子没有到达人眼，而 光线跟踪 背后的思想正是上述过程的反过程：从眼睛触发跟踪光线到场景中，计算光线与物体的交互过程，观察最终到达光源的光线。

![light-track](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-color-and-image/light-track.jpeg)

光线跟踪的基本形式可以描述为以下算法：

```bash
对于图像中的每一个像素:
 1. 由视点穿过像素构造光线
  2. 对于场景中的每一个对象
   2.1 寻找其与光线的交点
 3. 选取最近的交点
  4. 计算最近的交点处的颜色
```

在以上算法中省略 步骤4 将得到场景中对象的可视图，可视图是一张图像，其中每一个像素都是三维场景的一个可见部分。此时，算法称为 光线投射。更完善版本常被称为 经典光线跟踪算法：

```bash
对于图像中的每一个像素:
 1. 由视点穿过像素构造光线
  2. 重复直至满足终止条件
   2.1 对于场景中的每一个对象
     2.1.1 寻找对象与光线的交点
    2.2 选取最近的交点
    2.3 计算光线跟踪算法
  3. 基于光线路径计算颜色
```

基于以上算法，如果没有时间限制，当光线到达光源或者射出场景终止将十分简单。但是，算法不可能无限次执行，因此需要增加终止条件以判定光线已追踪到光源，包括限制 迭代次数（即光线在表面反射次数）、光线穿越的距离 或者 降低追踪光线需要的时间。

光线跟踪算法的开销可以进行如下评估：对于一束光线，进行其与所有m个物体的相交测试，对于𝑛ᵣ条光线的任意一条，最多进行𝑘次反射（𝑘是允许的最大反射次数）。通常，如果屏幕像素总数为𝑛ₚ，则应满足𝑛ᵣ>𝑛ₚ，因为需要每个像素至少有一束光线。因此光线跟踪算法的开销为：

![light-track-cost](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-color-and-image/light-track-cost.png)

其中，*Int(oᵢ)* 是一条光线与物体 *oᵢ* 相交测试的开销。然而，通过采用加速数据结构可以把相交测试开销减少至 *O(log(m))*。

### 光栅化流水线

光栅化绘制流水线 是应用最广泛的交互性图像绘制方法。

![pixel-processing](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-color-and-image/pixel-processing.jpeg)

在之前的WebGL基础系列文章中也介绍过，在此就不赘述。

光栅化流水线的执行开销包括所有顶点𝑛ᵥ的处理（即变换），以及所有几何图元的光栅化操作：

![rasterization-cost](https://raw.githubusercontent.com/LiJiahaoCoder/lijiahao.github.io/master/src/assets/articles/webgl/webgl-color-and-image/rasterization-cost.png)

其中，𝐾ₜ𝑟是转换一个顶点的开销，而𝑅𝑎𝒔(𝑝ᵢ)是光栅化一个图元的开销。

## 🎬结束语

”我^&%^%$@),[”（脏话连篇），刚看完第一章概述就要被劝退了😶‍🌫️

”天将降大任于斯人也，必先苦其心志，劳其筋骨... ...“，菜就不要给自己找理由了，努力充实自己，才能”担大任“。接下来会继续《计算机图形学导论》一书的学习，并且还会继续总结学习内容分享给大家！冲！冲！冲！🐛

发表于2020-06-19
