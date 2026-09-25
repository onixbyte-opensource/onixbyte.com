---
title: Captcha API
---

## 包结构概览

库的代码组织在基础包 `com.onixbyte.captcha` 下，结构如下：

| 包 | 描述 |
|---|---|
| `com.onixbyte.captcha` | 核心接口 |
| `com.onixbyte.captcha.impl` | 默认实现 |
| `com.onixbyte.captcha.text` | 文本生成器和渲染器接口 |
| `com.onixbyte.captcha.text.impl` | 文本生成器和渲染器实现 |
| `com.onixbyte.captcha.text.enums` | 文本相关枚举 |
| `com.onixbyte.captcha.background` | 背景生成器接口 |
| `com.onixbyte.captcha.background.impl` | 背景生成器实现 |
| `com.onixbyte.captcha.noise` | 噪点生成器接口 |
| `com.onixbyte.captcha.noise.impl` | 噪点生成器实现 |
| `com.onixbyte.captcha.gimpy` | 扭曲引擎接口 |
| `com.onixbyte.captcha.gimpy.impl` | 扭曲引擎实现 |

---

## Producer

负责创建 CAPTCHA 图片并在其上绘制文字的顶层接口。

```java
Producer captcha = DefaultCaptchaProducer.builder()
    .textProducer(textProducer)
    .wordRenderer(wordRenderer)
    .gimpyEngine(gimpyEngine)
    .backgroundProducer(backgroundProducer)
    .width(200)
    .height(50)
    .borderDrawn(true)
    .borderColour(Color.BLACK)
    .borderThickness(1)
    .build();

String text = captcha.createText();
BufferedImage image = captcha.createImage(text);
```

### DefaultCaptchaProducer Builder

| 方法 | 默认值 | 描述 |
|---|---|---|
| `textProducer` | `DefaultTextProducer.builder().build()` | 文本生成器 |
| `wordRenderer` | `DefaultWordRenderer.builder().build()` | 文字渲染器 |
| `gimpyEngine` | `WaterRipple.builder().build()` | 扭曲引擎 |
| `backgroundProducer` | `DefaultBackgroundProducer.builder().build()` | 背景生成器 |
| `width` | `200` | 验证码图片宽度 |
| `height` | `50` | 验证码图片高度 |
| `borderDrawn` | `true` | 是否绘制边框 |
| `borderColour` | `Color.BLACK` | 边框颜色 |
| `borderThickness` | `1` | 边框厚度 |

---

## Text

### TextProducer

用于创建 CAPTCHA 文本字符串的接口。

```java
public interface TextProducer {
    String getText();
}
```

#### DefaultTextProducer

生成可配置长度和字符集的随机文本。

```java
DefaultTextProducer textProducer = DefaultTextProducer.builder()
    .length(6)                                    // 默认: 6
    .chars("ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray()) // 默认: a-z, A-Z, 0-9
    .build();
```

| 方法 | 默认值 | 描述 |
|---|---|---|
| `length` | `6` | 生成文本的长度 |
| `chars` | `a-z`、`A-Z`、`0-9`（共 62 个字符） | 生成文本使用的字符集 |

### WordRenderer

将文字渲染到图片上的接口。

```java
public interface WordRenderer {
    BufferedImage renderWord(String word, int width, int height);
}
```

#### DefaultWordRenderer

使用可配置的字体、颜色和间距渲染文字。

```java
DefaultWordRenderer wordRenderer = DefaultWordRenderer.builder()
    .fontSize(40)                          // 默认: 40
    .fonts("Arial", "Courier")             // 默认: Arial, Courier
    .fontColour(Color.BLACK)               // 默认: Color.BLACK
    .charSpace(2)                          // 默认: 2
    .fontStyle(FontStyle.BOLD)             // 默认: FontStyle.BOLD
    .build();
```

| 方法 | 默认值 | 描述 |
|---|---|---|
| `fontSize` | `40` | 字号（像素） |
| `fonts` | `["Arial", "Courier"]` | 字体族（随机选择） |
| `fontColour` | `Color.BLACK` | 字体颜色 |
| `charSpace` | `2` | 字符间距（像素） |
| `fontStyle` | `FontStyle.BOLD` | 字体样式 |

### FontStyle

定义 CAPTCHA 文字渲染支持的字体样式。

| 值 | 对应的 AWT 常量 | 描述 |
|---|---|---|
| `PLAIN` | `java.awt.Font.PLAIN` | 普通样式 |
| `BOLD` | `java.awt.Font.BOLD` | 粗体 |
| `ITALIC` | `java.awt.Font.ITALIC` | 斜体 |
| `BOLD_ITALIC` | `java.awt.Font.BOLD | Font.ITALIC` | 粗斜体 |

---

## GimpyEngine

用于对图片应用扭曲效果的接口。

```java
public interface GimpyEngine {
    BufferedImage getDistortedImage(BufferedImage baseImage);
}
```

### WaterRipple

应用水波纹扭曲效果。继承 `AbstractGimpyEngine`，自动添加噪点。

```java
WaterRipple gimpy = WaterRipple.builder()
    .noiseProducer(DefaultNoiseProducer.builder().build())  // 默认: DefaultNoiseProducer
    .build();
```

| 方法 | 默认值 | 描述 |
|---|---|---|
| `noiseProducer` | `DefaultNoiseProducer.builder().build()` | 噪点生成器 |

### FishEyeGimpy

应用鱼眼扭曲效果，在图片上绘制水平和垂直线条。

```java
FishEyeGimpy gimpy = FishEyeGimpy.builder()
    .build();
```

### ShadowGimpy

应用阴影和波纹效果。继承 `AbstractGimpyEngine`，自动添加噪点。

```java
ShadowGimpy gimpy = ShadowGimpy.builder()
    .noiseProducer(DefaultNoiseProducer.builder().build())  // 默认: DefaultNoiseProducer
    .build();
```

| 方法 | 默认值 | 描述 |
|---|---|---|
| `noiseProducer` | `DefaultNoiseProducer.builder().build()` | 噪点生成器 |

---

## Noise

### NoiseProducer

向图片添加噪点的接口。

```java
public interface NoiseProducer {
    void makeNoise(BufferedImage image, float factorOne, float factorTwo,
                   float factorThree, float factorFour);
}
```

#### DefaultNoiseProducer

使用可配置的颜色添加噪点曲线。

```java
DefaultNoiseProducer noise = DefaultNoiseProducer.builder()
    .noiseColour(Color.BLACK) // 默认: Color.BLACK
    .build();
```

| 方法 | 默认值 | 描述 |
|---|---|---|
| `noiseColour` | `Color.BLACK` | 噪点颜色 |

#### NoNoiseProducer

不向图片添加任何噪点的空实现。

```java
NoiseProducer noise = NoNoiseProducer.builder()
    .build();
```

---

## Background

### BackgroundProducer

向图片添加背景的接口。

```java
public interface BackgroundProducer {
    BufferedImage addBackground(BufferedImage image);
}
```

#### DefaultBackgroundProducer

创建具有可配置起始和结束颜色的渐变背景。

```java
DefaultBackgroundProducer background = DefaultBackgroundProducer.builder()
    .colourFrom(Color.WHITE)       // 默认: Color.LIGHT_GRAY
    .colourTo(Color.LIGHT_GRAY)    // 默认: Color.WHITE
    .build();
```

| 方法 | 默认值 | 描述 |
|---|---|---|
| `colourFrom` | `Color.LIGHT_GRAY` | 渐变起始颜色 |
| `colourTo` | `Color.WHITE` | 渐变结束颜色 |
