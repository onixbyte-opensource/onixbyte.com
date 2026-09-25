---
title: ECMAScript 2025 Syntax Sugar Guide
tags:
  - javascript
  - ecmascript
  - pattern-matching
  - frontend
author:
  name: Zihlu Wang
  email: real@zihluwang.me
---

## Pattern Matching

### Traditional Approach

```javascript
function processResponse(response) {
  if (response.status === 200 && response.data) {
    return { success: true, data: response.data }
  } else if (response.status === 404) {
    return { success: false, error: "Not found" }
  } else if (response.status >= 500) {
    return { success: false, error: "Server error" }
  } else {
    return { success: false, error: "Unknown error" }
  }
}
```

### Pattern Matching Approach

```javascript
function processResponse(response) {
  return match (response) {
    when ({ status: 200, data }) -> ({ success: true, data })
    when ({ status: 404 }) -> ({ success: false, error: 'Not found' })
    when ({ status: status if status >= 500 }) -> ({ success: false, error: 'Server error' })
    default -> ({ success: false, error: 'Unknown error' })
  };
}
```

### Handling Array Length Branches Gracefully

```javascript
function handleArray(arr) {
  return match (arr) {
    when ([]) -> "Empty array"
    when ([first]) -> `Only one element: ${first}`
    when ([first, second]) -> `Two elements: ${first}, ${second}`
    when ([first, ...rest]) -> `First element: ${first}, others: ${rest.length} items`
  };
}
```
