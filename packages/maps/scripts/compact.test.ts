import { expect, test } from 'bun:test';

import { compact } from './compact';

test('compact writes points relative to the last and closes rings', () => {
  expect(compact('M10,10L20,10L20,20Z')).toBe('M10 10l10 0 0 10z');
});

test('compact drops repeated points and the closing point', () => {
  expect(compact('M10,10L10,10L20,10L20,20L10,10Z')).toBe('M10 10l10 0 0 10z');
});

test('compact drops a ring that collapses to under three points', () => {
  expect(compact('M10,10L10.2,10.1L10,10ZM0,0L5,0L5,5Z')).toBe('M0 0l5 0 0 5z');
});

test('compact keeps an open line of two points', () => {
  expect(compact('M0,0L3,4')).toBe('M0 0l3 4');
  expect(compact('M0,0L0.2,0.1')).toBe('');
});
