import { render } from '@geothai/maps';
import type { MapNode, MapShapes, RenderOptions } from '@geothai/maps/types';
import { type PropType, type VNode, defineComponent, h } from 'vue';

function node(n: MapNode): VNode {
  if (n.kind === 'label') {
    return h(
      'text',
      {
        x: n.x,
        y: n.y,
        'font-size': n.size,
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
        fill: '#0f1115',
        stroke: '#ffffff',
        'stroke-width': n.size / 5,
        'paint-order': 'stroke',
        'stroke-linejoin': 'round',
      },
      n.text,
    );
  }
  if (n.kind === 'line') {
    return h('path', {
      d: n.d,
      fill: 'none',
      stroke: n.stroke,
      'stroke-width': n.width,
      'stroke-linejoin': 'round',
      'vector-effect': 'non-scaling-stroke',
    });
  }
  const path = h('path', { d: n.d, fill: n.fill }, [h('title', n.label)]);
  return n.href ? h('a', { href: n.href }, [path]) : path;
}

/**
 * A map of Thailand as a Vue component. It draws the same model as `toSvg()` of
 * `@geothai/maps`, so the markup is the same in every framework.
 *
 * @example
 * <GeoThaiMap :map="provinces" :fills="fills" :href="(s) => `/provinces/${s.code}/`" />
 */
export const GeoThaiMap = defineComponent({
  name: 'GeoThaiMap',
  props: {
    /** `provinces`, `await districtMap('84')` or `await subdistrictMap('8405')`. */
    map: { type: Object as PropType<MapShapes>, required: true },
    fills: Object as PropType<RenderOptions['fills']>,
    fill: String,
    stroke: String,
    href: Function as PropType<RenderOptions['href']>,
    label: Function as PropType<RenderOptions['label']>,
    title: String,
    highlight: Array as PropType<RenderOptions['highlight']>,
    labels: Function as PropType<RenderOptions['labels']>,
    labelSize: Number,
  },
  setup(props) {
    return () => {
      const { map, ...options } = props;
      const model = render(map, options);
      return h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: model.viewBox,
          role: 'img',
          'aria-label': model.title,
        },
        [h('title', model.title), ...model.nodes.map(node)],
      );
    };
  },
});
