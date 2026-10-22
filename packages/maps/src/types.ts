/** One area on a map, already projected to the map's own coordinates. */
export type Shape = {
  /** DOPA code, such as `'84'` or `'8405'`. For a shape that covers several new areas, the first. */
  code: string;
  /** Every area the shape covers. Only a shape whose old border holds several new areas has it. */
  codes?: string[];
  name_th: string;
  name_en: string;
  /** SVG path data in whole map units. */
  d: string;
  /** Where a label goes: the point deepest inside the largest part of the area. */
  x: number;
  y: number;
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

/** What `fromNames()` returns. */
export type NameMatch = {
  /** The code of each name it could place, keyed by the name as given. */
  found: Record<string, string>;
  /** Names that match no area, or more than one. */
  unmatched: string[];
};

/** How `choropleth()` turns values into colors. */
export type ColorOptions = {
  /** Colors from low to high. Default: five steps from Mist to Black. */
  colors?: readonly string[];
  /**
   * `'quantile'` puts about the same number of areas in each color. `'equal'` cuts the range
   * into steps of the same size. Or give the upper bound of each color but the last.
   */
  breaks?: 'quantile' | 'equal' | number[];
};

/** One row of the legend: the color and the values it stands for. */
export type LegendItem = { color: string; from: number; to: number };

/** What `choropleth()` returns: a color for every area code, and the legend. */
export type Colors = { fills: Record<string, string>; legend: LegendItem[] };

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
  /** Text to write at the label point of each area. Return `undefined` for no label. */
  labels?: (shape: Shape) => string | undefined;
  /** Height of the label text in map units. Default: a fiftieth of the map width. */
  labelSize?: number;
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
    }
  | { kind: 'label'; code: string; x: number; y: number; text: string; size: number };

/** A map ready for any renderer: the SVG attributes and the elements inside it. */
export type MapModel = { viewBox: string; title: string; nodes: MapNode[] };
