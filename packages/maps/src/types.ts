/** One area on a map, already projected to the map's own coordinates. */
export type Shape = {
  /** DOPA code, such as `'84'` or `'8405'`. */
  code: string;
  name_th: string;
  name_en: string;
  /** SVG path data in whole map units. */
  d: string;
};

/** A set of areas drawn together, such as all provinces or the districts of one province. */
export type MapShapes = {
  width: number;
  height: number;
  shapes: Shape[];
  /** The lines between two areas, drawn once. */
  borders: string;
  /** The outer edge of all the areas together. */
  outline: string;
};

/** How `render()` draws a map. */
export type RenderOptions = {
  /** Fill color per area code. Areas without one use `fill`. */
  fills?: Record<string, string>;
  /** Default fill. */
  fill?: string;
  /** Color of the borders and the outline. */
  stroke?: string;
  /** Link for each area. Return `undefined` for no link. */
  href?: (shape: Shape) => string | undefined;
  /** Text read for each area and shown on hover. Default: the Thai and English names. */
  label?: (shape: Shape) => string;
  /** Accessible name of the whole map. */
  title?: string;
  /** Codes to draw on top with a thick stroke, such as the area of the current page. */
  highlight?: string[];
};

/** One element of a rendered map. Every adapter draws exactly these, in this order. */
export type MapNode =
  | { kind: 'area'; code: string; d: string; fill: string; label: string; href?: string }
  | {
      kind: 'line';
      key: 'borders' | 'outline' | 'highlight';
      d: string;
      stroke: string;
      /** Screen pixels: the line keeps its width at any map size. */
      width: number;
    };

/** A map ready for any renderer: the SVG attributes and the elements inside it. */
export type MapModel = { viewBox: string; title: string; nodes: MapNode[] };
