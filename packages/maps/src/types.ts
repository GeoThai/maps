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
