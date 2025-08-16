import "./style.css";

import { Canvas, Textbox } from "fabric";
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
import {
  CustomMainMenu,
  mainMenuContent,
  createShapesElement,
} from "./components/Elements.js";
import { DragCreate } from "./components/DragCreate.js";

addEventListener("DOMContentLoaded", (event) => {
  const canvas = createCanvas(); // ✅ get instance
  const menu = document.getElementById("customMenu");
  const header = document.getElementById("customMenuHeader");
  CustomMainMenu(canvas, menu);
  dragElement(menu, header, canvas);
  mainMenuContent();
  createShapesElement();
  DragCreate(canvas, removeControl, changeStyleControl);
  multipleSelectionStyle(canvas, removeControl);
  dragCanvas(canvas);
  zoomCanvas(canvas);
  deleteObject(canvas);
  mouseWheel(canvas);
  // drawGrid(canvas, 60);
  doubleClickObj(canvas);

  (function initToggle() {
    const cfg = { singleOpen: false }; // false = Elementor Toggle; true = Accordion

    const items = [
      { header: "#numbers-content", panel: "#numbers" },
      { header: "#shapes-content", panel: "#shapes" },
      { header: "#rulers-content", panel: "#rulers" },
    ];

    const headers = [];
    const panels = [];

    function prep(item) {
      const h = document.querySelector(item.header);
      const p = document.querySelector(item.panel);
      if (!h || !p) return;

      // Make the <h1> act like a button (accessible)
      h.setAttribute("role", "button");
      h.setAttribute("tabindex", "0");
      h.setAttribute("aria-controls", p.id);
      h.setAttribute("aria-expanded", "false");

      p.setAttribute("role", "region");
      p.setAttribute("aria-labelledby", h.id);

      // Start collapsed with smooth height animation
      p.style.overflow = "hidden";
      p.style.height = "0px";
      p.style.transition = "height 200ms ease";

      headers.push(h);
      panels.push(p);

      const toggle = () => {
        const isOpen = p.dataset.open === "true";
        if (cfg.singleOpen) {
          // close others first
          panels.forEach((other, i) => {
            if (other !== p) closePanel(other, headers[i]);
          });
        }
        isOpen ? closePanel(p, h) : openPanel(p, h);
      };

      h.addEventListener("click", toggle);
      h.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });
    }

    function openPanel(p, h) {
      p.dataset.open = "true";
      h.setAttribute("aria-expanded", "true");

      // from 0 -> content height -> auto
      p.style.display = "block";
      const target = p.scrollHeight; // measure
      p.style.height = target + "px";
      const onEnd = (e) => {
        if (e.propertyName === "height") {
          p.style.height = "auto"; // allow intrinsic growth
          p.removeEventListener("transitionend", onEnd);
        }
      };
      p.addEventListener("transitionend", onEnd);
    }

    function closePanel(p, h) {
      p.dataset.open = "false";
      h.setAttribute("aria-expanded", "false");

      // from current height -> 0
      p.style.height = p.scrollHeight + "px";
      // force reflow so transition triggers
      void p.offsetHeight;
      p.style.height = "0px";
    }

    items.forEach(prep);
  })();
  const menuContent = document.querySelector("#menu-content");
  const arrowUp = document.getElementById("arrow-up");
  const arrowDown = document.getElementById("arrow-down");

  arrowUp.addEventListener("click", () => {
    arrowUp.classList.add("hidden");
    arrowDown.classList.remove("hidden");
    menuContent.classList.add("hidden");
  });

  arrowDown.addEventListener("click", () => {
    arrowDown.classList.add("hidden");
    arrowUp.classList.remove("hidden");
    menuContent.classList.remove("hidden");
  });
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

// Add a simple textbox
