import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('keeps the complete volumetric fire interaction', async () => {
  const [html, source] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../src/main.js', import.meta.url), 'utf8'),
  ]);

  assert.match(html, /Volumetric Fire Simulation/);
  assert.match(source, /WebGPU\.isAvailable/);
  assert.match(source, /new OrbitControls/);
  assert.match(source, /new DragControls/);
  assert.match(source, /new TeapotGeometry/);
  assert.match(source, /new Inspector/);
});
