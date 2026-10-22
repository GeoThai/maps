# @geothai/maps-svelte

A Svelte 5 component that draws a map of Thailand on DOPA codes. It draws the same model as
`toSvg()` of [`@geothai/maps`](https://www.npmjs.com/package/@geothai/maps). The markup is the
same in every framework, and it renders on the server.

[👉 Source](https://github.com/GeoThai/maps)

## Install

```sh
npm install @geothai/maps-svelte @geothai/maps
```

## Use

```svelte
<script>
  import { choropleth, provinces } from '@geothai/maps';
  import { GeoThaiMap } from '@geothai/maps-svelte';

  const { fills } = choropleth(provinces, { 84: 912, 30: 381 });
</script>

<GeoThaiMap map={provinces} {fills} title="Thailand" href={(s) => `/provinces/${s.code}/`} />
```

`<GeoThaiMap>` takes `map` and every option of `render()`: `fills`, `fill`, `stroke`, `href`,
`label`, `title`, `highlight`, `labels` and `labelSize`.

[Full docs on geothai.fasu.dev](https://geothai.fasu.dev/docs/#maps), and try it with your table on the [map page](https://geothai.fasu.dev/map/).

## License

The code is MIT, the shapes CC BY 3.0 IGO (`MIT AND CC-BY-3.0-IGO`, full credits in `NOTICE`).
