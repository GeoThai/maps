import { expect, test } from 'bun:test';

import { choropleth } from './colors';
import type { MapShapes } from './types';

const map: MapShapes = {
  width: 10,
  height: 10,
  shapes: [
    { code: '10', name_th: 'x', name_en: 'x', d: 'M0 0' },
    { code: '11', name_th: 'x', name_en: 'x', d: 'M1 0' },
    { code: '12', name_th: 'x', name_en: 'x', d: 'M2 0' },
    { code: '13', name_th: 'x', name_en: 'x', d: 'M3 0' },
  ],
  borders: '',
  outline: '',
};

test('choropleth puts about the same number of areas in each color', () => {
  const values = { 10: 1, 11: 2, 12: 3, 13: 100 };
  const { fills, legend } = choropleth(map, values, { colors: ['a', 'b'] });
  expect(fills['10']).toBe('a');
  expect(fills['13']).toBe('b');
  expect(legend).toHaveLength(2);
  expect(legend[0]).toMatchObject({ color: 'a', from: 1 });
  expect(legend[1]).toMatchObject({ color: 'b', to: 100 });
});

test('choropleth respects given breaks and leaves empty codes to the caller', () => {
  const { fills } = choropleth(
    map,
    { 10: 5, 11: 9, 12: null },
    { breaks: [8], colors: ['low', 'high'] },
  );
  expect(fills).toEqual({ 10: 'low', 11: 'high' });
});

test('choropleth splits the range into equal steps', () => {
  const { legend } = choropleth(
    map,
    { 10: 0, 11: 10, 12: 5, 13: 5 },
    { breaks: 'equal', colors: ['a', 'b'] },
  );
  expect(legend[0]).toMatchObject({ from: 0, to: 5 });
  expect(legend[1]).toMatchObject({ from: 5, to: 10 });
});
