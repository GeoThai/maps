# @geothai/maps

Maps of Thailand for data, on DOPA codes. The shapes are already simplified and projected,
so the package needs no map library and no network at runtime, and works on the server.

[👉 Source, and maps for React](https://github.com/GeoThai/maps)

## Install

```sh
npm install @geothai/maps
```

## Draw a map

```js
import { provinces, render, toSvg } from '@geothai/maps';

const svg = toSvg(render(provinces, { title: 'Thailand', href: (s) => `/provinces/${s.code}/` }));
// → '<svg viewBox="0 0 1000 1875" …>…</svg>'
```

`provinces` holds all 77 provinces. For the districts of one province, load only that province:

```js
import { districtMap, subdistrictMap } from '@geothai/maps';

const surat = await districtMap('84'); // the 19 districts of Surat Thani
const kopangan = await subdistrictMap('8405'); // the 3 subdistricts of Ko Pha-ngan
```

Each province and each district is its own module, so a page loads only the map it shows.
The source lines date from 2022, before DOPA cut some new khwaeng in Bangkok out of older ones.
A shape that covers several of them has `codes` with all of them, and both names.

## Color areas by value

```js
import { choropleth } from '@geothai/maps';

const { fills, legend } = choropleth(provinces, { 84: 912, 30: 381 });
// fills: { 84: '#0f1115', 30: '#eef1f4', … }, legend: [{ color, from, to }, …]
```

`choropleth()` takes `breaks: 'quantile'` (default), `'equal'`, or your own bounds, and
`colors` (five GeoThai tones by default).

## Read names as people write them

```js
import { fromNames } from '@geothai/maps';

const { found, unmatched } = fromNames(['จ.สุราษฎร์ธานี', 'Chon Buri', 'กทม', 'โคราช'], provinces);
// found: { 'จ.สุราษฎร์ธานี': '84', 'Chon Buri': '20', กทม: '10' }
// unmatched: ['โคราช'], so you can fix it before you publish the map
```

A name matches after lower case, and without spaces, dots, apostrophes, hyphens and a leading
word such as "จังหวัด" or the short "จ.". "เมือง" and "Mueang" match the capital district
(code XX01). A code of the map passes through. A name that matches nothing, or more than one
area, comes back in `unmatched`.

## `<geothai-map>`

For plain HTML or any framework without an adapter:

```html
<script type="module">
  import '@geothai/maps/element';
</script>
<geothai-map title="Thailand" href="/provinces/{code}/"></geothai-map>
<geothai-map level="district" province="84" fills='{"8405": "#0f1115"}'></geothai-map>
```

The element draws into the light DOM, so server HTML, styles and links work as written.

## API

| Export                       | Returns                                                        |
| ---------------------------- | -------------------------------------------------------------- |
| `provinces`                  | All 77 provinces, with `width`, `height`, `borders`, `outline` |
| `districtMap(code)`          | The districts of one province, loaded on demand                |
| `hasDistrictMap(code)`       | `true` for every province code                                 |
| `subdistrictMap(code)`       | The subdistricts of one district, loaded on demand             |
| `hasSubdistrictMap(code)`    | `true` for every district code                                 |
| `provincesSmall`             | The country map at a fifth of the width, for locators          |
| `fromNames(names, map)`      | Codes for names as people write them, plus `unmatched`         |
| `choropleth(map, values, o)` | One fill per code, and the legend                              |
| `render(map, options)`       | The SVG attributes and elements, for your own renderer         |
| `toSvg(model)`               | The whole map as an SVG string                                 |
| types                        | `@geothai/maps/types`: `Shape`, `MapShapes`, `MapModel`, …     |

## Data

The shapes come from [GeoThai/boundaries](https://github.com/GeoThai/boundaries), checked
against the DOPA registry. The code is MIT, the shapes CC BY 3.0 IGO
(`MIT AND CC-BY-3.0-IGO`, full credits in `NOTICE`).
