import "./style.css";

import { Canvas } from "fabric";
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
  drawGrid,
  doubleClickObj,
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
  doubleClickObj(canvas);
});

// import { Line } from "fabric";

// // Create a pencil brush and set options
// const brush = new PencilBrush(canvas);
// brush.width = 3;
// brush.color = "blue";

// // Assign it to the canvas
// canvas.freeDrawingBrush = brush;

// let isDrawing = false;
// let currentLine = null;

// // create line
// canvas.on("mouse:down", (opt) => {
//   isDrawing = true;
//   const pointer = canvas.getPointer(opt.e);

//   currentLine = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
//     stroke: "black",
//     strokeWidth: 2,
//     selectable: false,
//     evented: false,
//   });

//   canvas.add(currentLine);
// });

// canvas.on("mouse:move", (opt) => {
//   if (!isDrawing) return;

//   const pointer = canvas.getPointer(opt.e);
//   currentLine.set({ x2: pointer.x, y2: pointer.y });
//   canvas.renderAll();
// });

// canvas.on("mouse:up", () => {
//   isDrawing = false;
//   currentLine = null;
// });
