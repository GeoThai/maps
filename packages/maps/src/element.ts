import { districtMap } from './index';
import { render } from './render';
import provinces from './shapes/provinces';
import type { MapModel, RenderOptions } from './types';

/**
 * `<geothai-map>`: a map as a custom element, for plain HTML or any framework without an adapter.
 *
 * The element draws into the light DOM, so server HTML, styles and links work as written.
 * It reads a JSON attribute or property for each option of {@link RenderOptions}.
 * The shapes load from `@geothai/maps`, never from the network.
 *
 * @example
 * <script type="module">
 *   import '@geothai/maps/element';
 * </script>
 * <geothai-map level="province" title="Thailand" href="/provinces/{code}/"></geothai-map>
 * <geothai-map level="district" province="84" fills='{"8405": "#0f1115"}'></geothai-map>
 */
export class GeoThaiMap extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['level', 'province', 'title', 'fills', 'href', 'highlight', 'stroke', 'fill'];
  }

  #level = 'province';
  #province?: string;

  connectedCallback(): void {
    if (!this.hasAttribute('level')) this.setAttribute('level', this.#level);
    void this.#draw();
  }

  attributeChangedCallback(): void {
    void this.#draw();
  }

  #options(): RenderOptions {
    const read = (name: string): unknown => {
      const text = this.getAttribute(name);
      if (text === null) return undefined;
      try {
        return JSON.parse(text) as unknown;
      } catch {
        return text;
      }
    };
    const fills = read('fills');
    const href = this.getAttribute('href');
    return {
      title: this.getAttribute('title') ?? undefined,
      fill: this.getAttribute('fill') ?? undefined,
      stroke: this.getAttribute('stroke') ?? undefined,
      fills:
        typeof fills === 'object' && fills !== null ? (fills as RenderOptions['fills']) : undefined,
      href: href ? (shape) => href.replaceAll('{code}', encodeURIComponent(shape.code)) : undefined,
      highlight: Array.isArray(read('highlight')) ? (read('highlight') as string[]) : undefined,
    };
  }

  async #draw() {
    this.#level = this.getAttribute('level') ?? 'province';
    this.#province = this.getAttribute('province') ?? undefined;
    let model: MapModel;
    try {
      const shapes =
        this.#level === 'district' ? await districtMap(this.#province ?? '') : provinces;
      model = render(shapes, this.#options());
    } catch (error) {
      this.replaceChildren(
        Object.assign(document.createElement('p'), { textContent: String(error) }),
      );
      return;
    }
    const svg = this.querySelector('svg');
    if (svg) {
      this.replaceChildren(svg);
      this.#paint(svg, model);
      return;
    }
    const next = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.#paint(next, model);
    this.replaceChildren(next);
  }

  #paint(svg: SVGSVGElement, model: MapModel) {
    svg.setAttribute('viewBox', model.viewBox);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', model.title);
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = model.title;
    svg.replaceChildren(title);
    for (const n of model.nodes) {
      if (n.kind === 'area') {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', n.d);
        path.setAttribute('fill', n.fill);
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        label.textContent = n.label;
        path.append(label);
        let area: Element = svg;
        if (n.href) {
          area = document.createElementNS('http://www.w3.org/2000/svg', 'a');
          area.setAttribute('href', n.href);
        }
        area.append(path);
        if (area !== svg) svg.append(area);
      } else {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', n.d);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', n.stroke);
        path.setAttribute('stroke-width', String(n.width));
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('vector-effect', 'non-scaling-stroke');
        svg.append(path);
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'geothai-map': GeoThaiMap;
  }
}

if (!customElements.get('geothai-map')) customElements.define('geothai-map', GeoThaiMap);
