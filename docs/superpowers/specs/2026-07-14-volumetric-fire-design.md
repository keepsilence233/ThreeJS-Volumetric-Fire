# Three.js Volumetric Fire Design

## Goal

Create a standalone browser project matching the Three.js r185 volumetric fire demo shown in the referenced X post. Preserve the full interaction: WebGPU fluid fire, draggable teapot turbulence, orbit camera, and parameter controls.

## Approach

Adapt the official MIT-licensed Three.js r185 `webgpu_volume_fire` example into a small Vite project instead of reimplementing its GPU fluid solver. Pin `three` to r185 so the copied example and runtime APIs stay aligned.

## Project shape

- `index.html`: full-screen application shell.
- `src/main.js`: official fire simulation adapted only for Vite imports and local assets.
- `public/`: any assets required by the official example.
- `package.json`: Vite scripts and the pinned Three.js dependency.
- `README.md`: requirements, install/run commands, controls, attribution, and WebGPU note.

No framework, backend, routing, or unrelated UI will be added.

## Runtime behavior

On load, the app initializes Three.js WebGPU rendering, the GPU fluid simulation, the fire volume, the teapot interaction, orbit controls, and the original parameter panel. Pointer dragging injects turbulence through the teapot; GUI changes update the existing simulation parameters directly. Resize events update the camera and renderer.

If WebGPU is unavailable, Three.js's WebGPU capability message remains visible instead of attempting a separate fallback renderer, because the reference simulation depends on WebGPU compute.

## Verification

- Install dependencies and run the production build.
- Serve the built app locally in a WebGPU-capable browser.
- Confirm the fire renders and animates.
- Confirm teapot dragging, orbit controls, GUI controls, and resizing work.
- Check the browser console for runtime errors.

## Delivery

Create the local repository at `~/github/Repositories/ThreeJS-Volumetric-Fire`, commit the completed project on `main`, create a public GitHub repository under `keepsilence233`, and push `main` with `gh`.
