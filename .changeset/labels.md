---
'@geothai/maps': minor
---

Add label points and labels. Every shape now has `x` and `y`, the point deepest inside its largest part. `render()` takes `labels` and `labelSize` to write text there, with a white stroke behind it, and `<geothai-map>` reads `labels="th"` or `labels="en"`.
