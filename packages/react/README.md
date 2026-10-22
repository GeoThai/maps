# @geothai/maps-react

A React component that draws a map of Thailand on DOPA codes. It draws the same model as
`toSvg()` of [`@geothai/maps`](https://www.npmjs.com/package/@geothai/maps). The markup is the
same in every framework. It works in server components with no client JavaScript.

[👉 Source](https://github.com/GeoThai/maps)

## Install

```sh
npm install @geothai/maps-react @geothai/maps
```

## Use

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

```jsx
import { provinces } from '@geothai/maps';

<GeoThaiMap
  map={provinces}
  title="Thailand"
  href={(s) => `/provinces/${s.code}/`}
  highlight={['84']}
/>;
```

## Props

`<GeoThaiMap>` takes `map` and every option of `render()`:

| Prop        | What it does                                                         |
| ----------- | -------------------------------------------------------------------- |
| `map`       | `provinces`, or the result of `await districtMap('84')`              |
| `fills`     | Fill color per area code                                             |
| `fill`      | Default fill                                                         |
| `stroke`    | Color of the borders and the outline                                 |
| `href`      | A function that returns the link of an area, or `undefined` for none |
| `highlight` | Codes to draw on top with a thick stroke                             |
| `label`     | Text for each area, shown on hover and to screen readers             |
| `title`     | Accessible name of the whole map                                     |

## License

The code is MIT, the shapes CC BY 3.0 IGO (`MIT AND CC-BY-3.0-IGO`, full credits in `NOTICE`).
