# @geothai/maps-vue

A Vue component that draws a map of Thailand on DOPA codes. It draws the same model as
`toSvg()` of [`@geothai/maps`](https://www.npmjs.com/package/@geothai/maps). The markup is the
same in every framework, and it renders on the server.

[👉 Source](https://github.com/GeoThai/maps)

## Install

```sh
npm install @geothai/maps-vue @geothai/maps
```

## Use

```vue
<script setup>
import { choropleth, provinces } from '@geothai/maps';
import { GeoThaiMap } from '@geothai/maps-vue';

const { fills } = choropleth(provinces, { 84: 912, 30: 381 });
</script>

<template>
  <GeoThaiMap
    :map="provinces"
    :fills="fills"
    title="Thailand"
    :href="(s) => `/provinces/${s.code}/`"
  />
</template>
```

`<GeoThaiMap>` takes `map` and every option of `render()`: `fills`, `fill`, `stroke`, `href`,
`label`, `title`, `highlight`, `labels` and `labelSize`.

## License

The code is MIT, the shapes CC BY 3.0 IGO (`MIT AND CC-BY-3.0-IGO`, full credits in `NOTICE`).
