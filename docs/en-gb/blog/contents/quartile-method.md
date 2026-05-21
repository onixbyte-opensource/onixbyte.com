---
title: The Quartile Method
tags:
  - statistics
  - algorithm
  - data-analysis
  - math
author:
  name: Zihlu Wang
  email: real@zihluwang.me
---

The quartile method is a commonly used statistical technique primarily employed for data analysis and presentation. The method divides a data set into four equal parts, each containing one quarter of the data. The key statistics include the first quartile (Q1), second quartile (Q2, the median), and third quartile (Q3).

- The first quartile (`Q1`), also known as the lower quartile, is the value at the 25th percentile of a data set sorted in ascending order.
- The second quartile (`Q2`), also known as the median, is the value at the 50th percentile of a data set sorted in ascending order.
- The third quartile (`Q3`), also known as the upper quartile, is the value at the 75th percentile of a data set sorted in ascending order.
- The interquartile range (`IQR`) is the difference between the third quartile and the first quartile, used to measure the dispersion of the middle 50% of data. The formula is IQR = Q3 - Q1. The IQR is commonly used in constructing box plots, an effective way to describe data distribution, particularly useful for identifying outliers.

Upper bound = Q3 + 1.5 × IQR.

Lower bound = Q1 - 1.5 × IQR.
