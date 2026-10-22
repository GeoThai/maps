import { render } from '@geothai/maps';
import type { MapNode, MapShapes, RenderOptions } from '@geothai/maps/types';
import type { ReactElement } from 'react';

/** Props of `<GeoThaiMap>`: the map to draw, and how. */
export type GeoThaiMapProps = RenderOptions & {
  /** `provinces`, or the result of `await districtMap('84')`, from `@geothai/maps`. */
  map: MapShapes;
};

function Node({ node }: Readonly<{ node: MapNode }>): ReactElement {
  if (node.kind === 'label') {
    return (
      <text
        x={node.x}
        y={node.y}
        fontSize={node.size}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#0f1115"
        stroke="#ffffff"
        strokeWidth={node.size / 5}
        paintOrder="stroke"
        strokeLinejoin="round"
      >
        {node.text}
      </text>
    );
  }
  if (node.kind === 'line') {
    return (
      <path
        d={node.d}
        fill="none"
        stroke={node.stroke}
        strokeWidth={node.width}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    );
  }
  const path = (
    <path d={node.d} fill={node.fill}>
      <title>{node.label}</title>
    </path>
  );
  return node.href ? <a href={node.href}>{path}</a> : path;
}

/**
 * A map of Thailand as React elements. It draws the same model as `toSvg()` and
 * `<geothai-map>`, so the markup is the same in every framework.
 *
 * @param props - The map and the options of `render()`.
 * @returns The `<svg>` element.
 * @example
 * import { provinces } from '@geothai/maps';
 * <GeoThaiMap map={provinces} href={(s) => `/provinces/${s.code}/`} />
 */
export function GeoThaiMap(props: Readonly<GeoThaiMapProps>): ReactElement {
  const { map, ...options } = props;
  const model = render(map, options);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={model.viewBox}
      role="img"
      aria-label={model.title}
    >
      <title>{model.title}</title>
      {model.nodes.map((n) => (
        <Node key={n.kind === 'line' ? n.key : `${n.kind}${n.code}`} node={n} />
      ))}
    </svg>
  );
}
