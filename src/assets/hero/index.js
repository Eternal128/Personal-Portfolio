// Small WebP copies of the hero screenshots, made by scripts/optimize-hero-images.mjs.
// Keyed by project name; a project without an entry falls back to its full image.
import vortex1440 from "./vortex-1440.webp";
import vortex960 from "./vortex-960.webp";
import carver1440 from "./carver-1440.webp";
import carver960 from "./carver-960.webp";
import coven1440 from "./coven-1440.webp";
import coven960 from "./coven-960.webp";

const shot = (large, small) => ({
  src: large,
  srcSet: `${small} 960w, ${large} 1440w`,
  width: 1440,
  height: 900,
});

export const heroShots = {
  Vortex: shot(vortex1440, vortex960),
  Carver: shot(carver1440, carver960),
  Coven: shot(coven1440, coven960),
};
