---
title: Captcha API
---

## Package Overview

The library is organised under the base package `com.onixbyte.captcha` with the following structure:

| Package                                | Description                           |
| -------------------------------------- | ------------------------------------- |
| `com.onixbyte.captcha`                 | Core interfaces                       |
| `com.onixbyte.captcha.impl`            | Default implementations               |
| `com.onixbyte.captcha.text`            | Text producer and renderer interfaces |
| `com.onixbyte.captcha.text.impl`       | Text producer and renderer impls      |
| `com.onixbyte.captcha.text.enums`      | Text-related enums                    |
| `com.onixbyte.captcha.background`      | Background producer interface         |
| `com.onixbyte.captcha.background.impl` | Background producer implementations   |
| `com.onixbyte.captcha.noise`           | Noise producer interface              |
| `com.onixbyte.captcha.noise.impl`      | Noise producer implementations        |
| `com.onixbyte.captcha.gimpy`           | Distortion engine interface           |
| `com.onixbyte.captcha.gimpy.impl`      | Distortion engine implementations     |

---

## Producer

The top-level interface responsible for creating CAPTCHA images with text drawn on them.

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

| Method               | Default Value                                 | Description                    |
| -------------------- | --------------------------------------------- | ------------------------------ |
| `textProducer`       | `DefaultTextProducer.builder().build()`       | The text producer to use       |
| `wordRenderer`       | `DefaultWordRenderer.builder().build()`       | The word renderer to use       |
| `gimpyEngine`        | `WaterRipple.builder().build()`               | The distortion engine to use   |
| `backgroundProducer` | `DefaultBackgroundProducer.builder().build()` | The background producer to use |
| `width`              | `200`                                         | Width of the CAPTCHA image     |
| `height`             | `50`                                          | Height of the CAPTCHA image    |
| `borderDrawn`        | `true`                                        | Whether a border is drawn      |
| `borderColour`       | `Color.BLACK`                                 | The colour of the border       |
| `borderThickness`    | `1`                                           | The thickness of the border    |

---

## Text

### TextProducer

Interface for creating CAPTCHA text strings.

```java
public interface TextProducer {
    String getText();
}
```

#### DefaultTextProducer

Generates random text with configurable length and character set.

```java
DefaultTextProducer textProducer = DefaultTextProducer.builder()
    .length(6)                                    // default: 6
    .chars("ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray()) // default: a-z, A-Z, 0-9
    .build();
```

| Method   | Default Value                       | Description                    |
| -------- | ----------------------------------- | ------------------------------ |
| `length` | `6`                                 | Length of generated text       |
| `chars`  | `a-z`, `A-Z`, `0-9` (62 characters) | Characters used for generation |

### WordRenderer

Interface for rendering text onto an image.

```java
public interface WordRenderer {
    BufferedImage renderWord(String word, int width, int height);
}
```

#### DefaultWordRenderer

Renders text with configurable font, colour, and spacing.

```java
DefaultWordRenderer wordRenderer = DefaultWordRenderer.builder()
    .fontSize(40)                          // default: 40
    .fonts("Arial", "Courier")             // default: Arial, Courier
    .fontColour(Color.BLACK)               // default: Color.BLACK
    .charSpace(2)                          // default: 2
    .fontStyle(FontStyle.BOLD)             // default: FontStyle.BOLD
    .build();
```

| Method       | Default Value          | Description                            |
| ------------ | ---------------------- | -------------------------------------- |
| `fontSize`   | `40`                   | Font size in pixels                    |
| `fonts`      | `["Arial", "Courier"]` | Font families to use (randomly chosen) |
| `fontColour` | `Color.BLACK`          | Font colour                            |
| `charSpace`  | `2`                    | Space between characters in pixels     |
| `fontStyle`  | `FontStyle.BOLD`       | Font style to apply                    |

### FontStyle

Defines the supported font styles for rendering CAPTCHA text.

| Value         | Corresponding AWT Constant | Description  |
| ------------- | -------------------------- | ------------ | ------------------------ |
| `PLAIN`       | `java.awt.Font.PLAIN`      | Plain style  |
| `BOLD`        | `java.awt.Font.BOLD`       | Bold style   |
| `ITALIC`      | `java.awt.Font.ITALIC`     | Italic style |
| `BOLD_ITALIC` | `java.awt.Font.BOLD        | Font.ITALIC` | Bold and italic combined |

---

## GimpyEngine

Interface for applying image distortion effects.

```java
public interface GimpyEngine {
    BufferedImage getDistortedImage(BufferedImage baseImage);
}
```

### WaterRipple

Applies a water ripple distortion effect. Extends `AbstractGimpyEngine` and adds noise automatically.

```java
WaterRipple gimpy = WaterRipple.builder()
    .noiseProducer(DefaultNoiseProducer.builder().build())  // default: DefaultNoiseProducer
    .build();
```

| Method          | Default Value                            | Description               |
| --------------- | ---------------------------------------- | ------------------------- |
| `noiseProducer` | `DefaultNoiseProducer.builder().build()` | The noise producer to use |

### FishEyeGimpy

Applies a fish-eye distortion effect with horizontal and vertical lines over the image.

```java
FishEyeGimpy gimpy = FishEyeGimpy.builder()
    .build();
```

### ShadowGimpy

Applies a shadow and ripple effect. Extends `AbstractGimpyEngine` and adds noise automatically.

```java
ShadowGimpy gimpy = ShadowGimpy.builder()
    .noiseProducer(DefaultNoiseProducer.builder().build())  // default: DefaultNoiseProducer
    .build();
```

| Method          | Default Value                            | Description               |
| --------------- | ---------------------------------------- | ------------------------- |
| `noiseProducer` | `DefaultNoiseProducer.builder().build()` | The noise producer to use |

---

## Noise

### NoiseProducer

Interface for adding noise to an image.

```java
public interface NoiseProducer {
    void makeNoise(BufferedImage image, float factorOne, float factorTwo,
                   float factorThree, float factorFour);
}
```

#### DefaultNoiseProducer

Adds noise curves with configurable colour.

```java
DefaultNoiseProducer noise = DefaultNoiseProducer.builder()
    .noiseColour(Color.BLACK) // default: Color.BLACK
    .build();
```

| Method        | Default Value | Description      |
| ------------- | ------------- | ---------------- |
| `noiseColour` | `Color.BLACK` | The noise colour |

#### NoNoiseProducer

A no-op implementation that does not add any noise to the image.

```java
NoiseProducer noise = NoNoiseProducer.builder()
    .build();
```

---

## Background

### BackgroundProducer

Interface for adding background to an image.

```java
public interface BackgroundProducer {
    BufferedImage addBackground(BufferedImage image);
}
```

#### DefaultBackgroundProducer

Creates a gradient background with configurable start and end colours.

```java
DefaultBackgroundProducer background = DefaultBackgroundProducer.builder()
    .colourFrom(Color.WHITE)       // default: Color.LIGHT_GRAY
    .colourTo(Color.LIGHT_GRAY)    // default: Color.WHITE
    .build();
```

| Method       | Default Value      | Description                     |
| ------------ | ------------------ | ------------------------------- |
| `colourFrom` | `Color.LIGHT_GRAY` | The starting colour of gradient |
| `colourTo`   | `Color.WHITE`      | The ending colour of gradient   |
