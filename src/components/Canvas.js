import { Canvas } from "fabric";

export function createCanvas() {
  const canvasEl = document.getElementById("canvas");

  canvasEl.width = window.innerWidth;
  canvasEl.height = window.innerHeight;
  let canvas;

  canvas = new Canvas(canvasEl, {
    preserveObjectStacking: true,
    perPixelTargetFind: true, // click detection checks transparency
    // isDrawingMode: true, // turn on free drawing
  });

  canvas.defaultCursor = "grab";
  canvas.hoverCursor = "grab";
  canvas.moveCursor = "grabbing";
  canvas.selectionColor = "rgba(100, 100, 255, 0.3)";
  canvas.selectionBorderColor = "blue";
  canvas.selectionLineWidth = 2;
  canvas.backgroundColor = null; // light gray background
  canvas.requestRenderAll();
  return canvas; // ✅ now other functions can use it
}
