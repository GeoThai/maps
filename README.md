# GeoThai maps

Maps of Thailand for data, on DOPA codes. `@geothai/maps` draws a map as an SVG string for
any framework, and `@geothai/maps-react` draws it as a React component. The shapes come from
[GeoThai/boundaries](https://github.com/GeoThai/boundaries), already simplified and projected,
so the package needs no map library and no network at runtime.

## Packages

| Package                                   | What it gives                                                                            |
| ----------------------------------------- | ---------------------------------------------------------------------------------------- |
| [`@geothai/maps`](./packages/maps)        | `provinces`, `districtMap('84')`, `render()`, `toSvg()`, `choropleth()`, `<geothai-map>` |
| [`@geothai/maps-react`](./packages/react) | `<GeoThaiMap map={provinces} />`, the same markup as `toSvg()`                           |

## Example

```js
import { choropleth, provinces, render, toSvg } from '@geothai/maps';

const { fills, legend } = choropleth(provinces, { 84: 912, 30: 381 });
const svg = toSvg(
  render(provinces, { fills, title: 'Thailand', href: (s) => `/provinces/${s.code}/` }),
);
// → '<svg viewBox="0 0 1000 1875" …>…</svg>'
```

```jsx
import { choropleth, districtMap } from '@geothai/maps';
import { GeoThaiMap } from '@geothai/maps-react';

// A React Server Component: the shapes load on the server.
export async function SuratThani({ values }) {
  const map = await districtMap('84');
  const { fills } = choropleth(map, values);
  return <GeoThaiMap map={map} fills={fills} />;
}
```

## Status

This repo is in development. The API can still change before 0.1.0.

## License

The code is MIT. The shapes inside are CC BY 3.0 IGO, from
[GeoThai/boundaries](https://github.com/GeoThai/boundaries), drawn by the Royal Thai Survey
Department. The package ships under `MIT AND CC-BY-3.0-IGO` with the full credits in `NOTICE`.
