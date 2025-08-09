import "./style.css";
import { Line } from "fabric";
// index.js
import { createCanvas } from "./components/Canvas.js";
import {
  removeControl,
  dragElement,
  changeStyleControl,
  dragCanvas,
  zoomCanvas,
  deleteObject,
  multipleSelectionStyle,
  mouseWheel,
} from "./components/Options.js";
import { CustomMainMenu } from "./components/Elements.js";
import { DragCreate } from "./components/DragCreate.js";

const canvas = createCanvas(); // ✅ get instance

addEventListener("DOMContentLoaded", (event) => {
  const menu = document.getElementById("customMenu");
  const header = document.getElementById("customMenuHeader");
  CustomMainMenu(canvas, menu);
  dragElement(menu, header, canvas);
  DragCreate(canvas, removeControl, changeStyleControl);
  multipleSelectionStyle(canvas, removeControl);
  dragCanvas(canvas);
  zoomCanvas(canvas);
  deleteObject(canvas);
  mouseWheel(canvas);
  drawGrid(canvas, 60);
});
function drawGrid(canvas, gridSize = 50) {
  const width = 8000;
  const height = 6000;

  const halfWidth = width / 2;
  const halfHeight = height / 2;

  for (let x = -halfWidth; x <= halfWidth; x += gridSize) {
    canvas.add(
      new Line([x, -halfHeight, x, halfHeight], {
        stroke: "#c7e4ffff",
        selectable: false,
        evented: false,
      })
    );
  }

  for (let y = -halfHeight; y <= halfHeight; y += gridSize) {
    canvas.add(
      new Line([-halfWidth, y, halfWidth, y], {
        stroke: "#c7e4ffff",
        selectable: false,
        evented: false,
      })
    );
  }

  canvas.requestRenderAll();
}
