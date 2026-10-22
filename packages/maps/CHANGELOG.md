# @geothai/maps

## 0.3.1

### Patch Changes

- [`233c15a`](https://github.com/GeoThai/maps/commit/233c15a934adabd3e00a3989c4a37e10c493fa1e) Thanks [@pyyupsk](https://github.com/pyyupsk)! - Link to the docs and the map page of geothai.fasu.dev from each README.

## 0.3.0

### Minor Changes

- [`b6c6297`](https://github.com/GeoThai/maps/commit/b6c6297250949b7f0a58dd5c3ed3531978d4b2f6) Thanks [@pyyupsk](https://github.com/pyyupsk)! - Add label points and labels. Every shape now has `x` and `y`, the point deepest inside its largest part. `render()` takes `labels` and `labelSize` to write text there, with a white stroke behind it, and `<geothai-map>` reads `labels="th"` or `labels="en"`.

- [`a23c62d`](https://github.com/GeoThai/maps/commit/a23c62d016f0b1c93ad3b1fa4897c18de7528ff4) Thanks [@pyyupsk](https://github.com/pyyupsk)! - Add `subdistrictMap(code)` and `hasSubdistrictMap(code)`: the subdistricts of each district, one module per district. A shape that covers several new khwaeng lists them in `codes`.

## 0.2.0

### Minor Changes

- [`1b39b00`](https://github.com/GeoThai/maps/commit/1b39b003b20bf4026bc2af5d9701592435895426) Thanks [@pyyupsk](https://github.com/pyyupsk)! - Add `provincesSmall`, the country map at a fifth of the width, for locators and thumbnails.

## 0.1.1

### Patch Changes

- [`228cef9`](https://github.com/GeoThai/maps/commit/228cef90372de965fe833d202eeaac8a03675109) Thanks [@pyyupsk](https://github.com/pyyupsk)! - Each package ships its own README.

## 0.1.0

### Minor Changes

- [`fe92633`](https://github.com/GeoThai/maps/commit/fe92633974ad6ea542fbfddd008d43c9c5f1d58b) Thanks [@pyyupsk](https://github.com/pyyupsk)! - First release: province and district maps of Thailand on DOPA codes, `fromNames()`, `choropleth()`, `toSvg()`, the `<geothai-map>` element and the React component.
