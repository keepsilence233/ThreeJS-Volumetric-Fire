# Volumetric Fire Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Build and publish a standalone Vite project matching the Three.js r185 WebGPU volumetric fire example with all original interactions.

**Architecture:** Reuse the official r185 example solver and UI, mechanically separating its inline module and stylesheet into Vite entry files. A single Node standard-library smoke test protects the required WebGPU, orbit, drag, teapot, and inspector integrations; Vite's production build verifies the complete module graph.

**Tech Stack:** Node.js 22, Vite 8.1.4, Three.js 0.185.0, WebGPU, Node `node:test`, Git, GitHub CLI.

## Global Constraints

- Preserve WebGPU fluid fire, draggable teapot turbulence, orbit camera, and parameter controls.
- Pin `three` to exactly `0.185.0`.
- Add no framework, backend, routing, fallback renderer, or unrelated UI.
- Deliver a public `keepsilence233/ThreeJS-Volumetric-Fire` repository from `~/github/Repositories/ThreeJS-Volumetric-Fire` on `main`.

## File map

- `index.html`: full-screen shell and original example information panel.
- `src/main.js`: official r185 simulation module with Vite-compatible bare imports.
- `src/style.css`: official example presentation styles.
- `test/project.test.mjs`: one dependency-free source smoke test.
- `package.json`: pinned dependencies and runnable scripts.
- `README.md`: setup, controls, requirements, and attribution.
- `LICENSE`: MIT license inherited from the reused Three.js example.

---

### Task 1: Create the standalone fire application

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/style.css`
- Create: `test/project.test.mjs`

**Interfaces:**
- Consumes: Three.js package exports `three/webgpu`, `three/tsl`, and `three/addons/*` at version `0.185.0`.
- Produces: Vite entry page at `/`, scripts `npm test`, `npm run dev`, `npm run build`, and `npm run preview`.

- [x] **Step 1: Add the failing smoke test**

```js
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
```

- [x] **Step 2: Run the test and confirm the missing app fails**

Run: `node --test test/project.test.mjs`

Expected: FAIL with `ENOENT` for `index.html` or `src/main.js`.

- [x] **Step 3: Add the package manifest**

```json
{
  "name": "threejs-volumetric-fire",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "node --test"
  },
  "dependencies": {
    "three": "0.185.0"
  },
  "devDependencies": {
    "vite": "8.1.4"
  }
}
```

- [x] **Step 4: Adapt the official r185 example without rewriting its solver**

Use the exact upstream files:

```bash
curl -fsS https://raw.githubusercontent.com/mrdoob/three.js/r185/examples/webgpu_volume_fire.html -o /tmp/webgpu_volume_fire.html
curl -fsS https://raw.githubusercontent.com/mrdoob/three.js/r185/examples/example.css -o /tmp/example.css
```

Perform the adaptation mechanically so the simulation code stays unchanged:

```bash
mkdir -p src
cp /tmp/webgpu_volume_fire.html src/main.js
perl -0pi -e 's#.*?<script type="module">\s*(.*?)\s*</script>.*#$1#s; s/^\t\t\t//mg' src/main.js
cp /tmp/webgpu_volume_fire.html index.html
perl -0pi -e 's#\n\t\t<script type="importmap">.*?</script>\n##s; s#\n\t\t<script type="module">.*?</script>\n#\n\t\t<script type="module" src="/src/main.js"></script>\n#s; s#href="example\.css"#href="/src/style.css"#' index.html
cp /tmp/example.css src/style.css
```

Expected: `src/main.js` contains every upstream import, constant, compute pass, scene setup, GUI folder, control, resize handler, and animation function; `index.html` contains no import map or inline module.

- [x] **Step 5: Install and verify the app**

Run: `npm_config_cache=/tmp/npm-cache npm install`

Expected: dependencies install successfully and `package-lock.json` is created.

Run: `npm test && npm run build`

Expected: one test passes; Vite emits `dist/index.html` and bundled assets without errors.

- [x] **Step 6: Commit the working application**

```bash
git add package.json package-lock.json index.html src test
git commit -m "feat: add WebGPU volumetric fire demo"
```

---

### Task 2: Document, inspect, and publish the result

**Files:**
- Create: `README.md`
- Create: `LICENSE`
- Modify: `docs/superpowers/plans/2026-07-14-volumetric-fire.md`

**Interfaces:**
- Consumes: Task 1's `npm test`, `npm run build`, and `npm run dev` commands.
- Produces: documented public GitHub repository with `origin/main` tracking the local `main` branch.

- [x] **Step 1: Add README documentation**

```markdown
# Three.js Volumetric Fire

A standalone Vite adaptation of the Three.js r185 WebGPU volumetric fire example.

## Run

```bash
npm install
npm run dev
```

Open the local URL in a WebGPU-capable browser.

## Controls

- Drag the teapot to inject turbulence.
- Drag outside the teapot to orbit the camera.
- Use the inspector panel to tune fire, smoke, fluid, lighting, and tone-mapping parameters.

## Build

```bash
npm test
npm run build
```

## Attribution

Adapted from the MIT-licensed [Three.js r185 volumetric fire example](https://github.com/mrdoob/three.js/blob/r185/examples/webgpu_volume_fire.html).
```

- [x] **Step 2: Add the upstream MIT license**

Copy the exact r185 license:

```bash
curl -fsS https://raw.githubusercontent.com/mrdoob/three.js/r185/LICENSE -o /tmp/three-license
```

Save that content unchanged as `LICENSE`.

- [x] **Step 3: Verify behavior in a real browser**

Run: `npm run dev -- --host 127.0.0.1`

Open the printed URL in a WebGPU-capable browser and verify:

- Fire appears and continues animating after initialization.
- Dragging the teapot changes its position and disturbs the fire.
- Dragging outside the teapot orbits the camera.
- Inspector controls are visible and change simulation/render parameters.
- Resizing the viewport keeps a full-screen canvas.
- Browser console contains no application errors.

- [x] **Step 4: Run final automated verification**

Run: `npm test && npm run build && git diff --check`

Expected: one test passes, the build succeeds, and `git diff --check` prints nothing.

- [x] **Step 5: Commit documentation and the checked plan**

Mark all completed plan checkboxes, then run:

```bash
git add README.md LICENSE docs/superpowers/plans/2026-07-14-volumetric-fire.md
git commit -m "docs: add usage and attribution"
```

- [x] **Step 6: Create and push the public repository**

Run:

```bash
gh repo create keepsilence233/ThreeJS-Volumetric-Fire --public --source=. --remote=origin --push
```

Expected: GitHub creates the public repository and local `main` tracks `origin/main`.

Run: `gh repo view keepsilence233/ThreeJS-Volumetric-Fire --json nameWithOwner,visibility,url,defaultBranchRef`

Expected: `nameWithOwner` is `keepsilence233/ThreeJS-Volumetric-Fire`, visibility is `PUBLIC`, and the default branch is `main`.
