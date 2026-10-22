import { expect, test } from 'bun:test';

import { render, toSvg } from './render';
import provinces from './shapes/provinces';
import type { MapShapes } from './types';

const tiny: MapShapes = {
  width: 10,
  height: 10,
  shapes: [
    { code: '10', name_th: 'กรุงเทพมหานคร', name_en: 'Bangkok', d: 'M0 0l5 0 0 5z', x: 2, y: 2 },
    { code: '11', name_th: 'A <b>"&', name_en: 'Q', d: 'M5 0l5 0 0 5z', x: 7, y: 2 },
  ],
  borders: 'M5 0l0 5',
  outline: 'M0 0l10 0',
};

test('render lays out areas first, then borders and outline', () => {
  const model = render(tiny, { fills: { 10: '#000' } });
  expect(model.viewBox).toBe('0 0 10 10');
  expect(model.nodes.map((n) => (n.kind === 'line' ? n.key : n.code))).toEqual([
    '10',
    '11',
    'borders',
    'outline',
  ]);
  expect(model.nodes[0]).toMatchObject({ fill: '#000', label: 'กรุงเทพมหานคร Bangkok' });
  expect(model.nodes[1]).toMatchObject({ fill: '#eef1f4' });
});

test('render adds links and draws the highlight on top', () => {
  const model = render(tiny, { href: (s) => `/p/${s.code}/`, highlight: ['11'] });
  expect(model.nodes[0]).toMatchObject({ href: '/p/10/' });
  expect(model.nodes.at(-1)).toMatchObject({ key: 'highlight', d: 'M5 0l5 0 0 5z' });
});

test('toSvg escapes labels and links and names the map', () => {
  const svg = toSvg(render(tiny, { title: 'T & U', href: () => '/a?b=1&c=2' }));
  expect(svg).toStartWith(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" role="img" aria-label="T &amp; U">',
  );
  expect(svg).toContain('<title>A &lt;b&gt;&quot;&amp; Q</title>');
  expect(svg).toContain('<a href="/a?b=1&amp;c=2">');
  expect(svg).not.toContain('<b>');
});

test('toSvg draws every province', () => {
  const svg = toSvg(render(provinces));
  expect(svg.match(/<path d="[^"]+" fill="#/g)).toHaveLength(77);
});

test('render writes a label at the label point of each area it is asked for', () => {
  const model = render(tiny, {
    labels: (s) => (s.code === '10' ? 'Bangkok & co' : undefined),
    labelSize: 4,
  });
  expect(model.nodes.at(-1)).toEqual({
    kind: 'label',
    code: '10',
    x: 2,
    y: 2,
    text: 'Bangkok & co',
    size: 4,
  });
  expect(toSvg(model)).toContain('<text x="2" y="2" font-size="4"');
  expect(toSvg(model)).toContain('>Bangkok &amp; co</text>');
});
