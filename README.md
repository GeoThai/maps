# GeoThai maps

Maps of Thailand for data, on DOPA codes. `@geothai/maps` draws a map as an SVG string for
any framework, and `@geothai/maps-react` draws it as a React component. The shapes come from
[GeoThai/boundaries](https://github.com/GeoThai/boundaries), already simplified and projected,
so the package needs no map library and no network at runtime.

## Packages

| Package                                   | What it gives                                                                                           |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [`@geothai/maps`](./packages/maps)        | `provinces`, `districtMap('84')`, `fromNames()`, `render()`, `toSvg()`, `choropleth()`, `<geothai-map>` |
| [`@geothai/maps-react`](./packages/react) | `<GeoThaiMap map={provinces} />`, the same markup as `toSvg()`                                          |

## Example

```js
import { choropleth, fromNames, provinces, render, toSvg } from '@geothai/maps';

// Names from a spreadsheet, as people typed them.
const sheet = { 'จ.สุราษฎร์ธานี': 912, 'Chon Buri': 381, กทม: 1204, โคราช: 260 };
const { found, unmatched } = fromNames(Object.keys(sheet), provinces);
// unmatched: ['โคราช'], so you can fix it before you publish the map
const values = Object.fromEntries(Object.entries(found).map(([name, code]) => [code, sheet[name]]));

const { fills, legend } = choropleth(provinces, values);
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
