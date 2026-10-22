import type { MapModel, MapNode, MapShapes, RenderOptions } from './types';

const escape = (text: string) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

/**
 * Lays a map out: the SVG attributes and every element inside, in draw order.
 * This is the one function every adapter draws from, so all frameworks show the same map.
 *
 * @param map - The areas to draw, from `provinces` or a `districtMap()`.
 * @param options - See {@link RenderOptions}.
 * @returns The model: a viewBox, a title and the elements in draw order.
 * @example
 * render(map, { fills: { 84: '#0f1115' } });
 * // { viewBox: '0 0 1000 1875', title: '…', nodes: [{ kind: 'area', … }, …] }
 */
export function render(map: MapShapes, options: RenderOptions = {}): MapModel {
  const fills = options.fills ?? {};
  const fill = options.fill ?? '#eef1f4';
  const stroke = options.stroke ?? '#0f1115';
  const label = options.label ?? ((s) => `${s.name_th} ${s.name_en}`);
  const areas: MapNode[] = map.shapes.map((s) => ({
    kind: 'area',
    code: s.code,
    d: s.d,
    fill: fills[s.code] ?? fill,
    label: label(s),
    href: options.href?.(s),
  }));
  const lines: MapNode[] = [
    { kind: 'line', key: 'borders', d: map.borders, stroke, width: 0.5 },
    { kind: 'line', key: 'outline', d: map.outline, stroke, width: 1 },
  ];
  if (options.highlight?.length) {
    const paths = map.shapes.filter((s) => options.highlight?.includes(s.code)).map((s) => s.d);
    if (paths.length) {
      lines.push({
        kind: 'line',
        key: 'highlight',
        d: paths.join(''),
        stroke,
        width: 2,
      });
    }
  }
  return {
    viewBox: `0 0 ${map.width} ${map.height}`,
    title: options.title ?? 'Map of Thailand',
    nodes: [...areas, ...lines],
  };
}

const nodeSvg = (n: MapNode) => {
  switch (n.kind) {
    case 'area': {
      const path = `<path d="${n.d}" fill="${escape(n.fill)}"><title>${escape(n.label)}</title></path>`;
      return n.href ? `<a href="${escape(n.href)}">${path}</a>` : path;
    }
    case 'line':
      return (
        `<path d="${n.d}" fill="none" stroke="${escape(n.stroke)}" stroke-width="${n.width}" ` +
        'stroke-linejoin="round" vector-effect="non-scaling-stroke"/>'
      );
  }
};

/**
 * Draws the model as an SVG string, for a server response, a file, or plain HTML.
 *
 * @param model - What `render()` returned.
 * @returns The whole `<svg>` element.
 * @example
 * toSvg(render(provinces, { title: 'Thailand' }));
 * // '<svg viewBox="0 0 1000 1875" role="img" …>…</svg>'
 */
export function toSvg(model: MapModel): string {
  const body = model.nodes.map(nodeSvg).join('');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${model.viewBox}" role="img" ` +
    `aria-label="${escape(model.title)}"><title>${escape(model.title)}</title>${body}</svg>`
  );
}
