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

  function generateRuler(svgId) {
    const svg = document.getElementById(svgId);

    // Helper for SVG element creation
    const createSvgEl = (tag, attrs) => {
      const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
      for (let k in attrs) el.setAttribute(k, attrs[k]);
      return el;
    };

    // Background rectangle
    svg.appendChild(
      createSvgEl("rect", {
        width: 900,
        height: 194,
        fill: "rgba(173,216,230,0.5)",
      })
    );

    // Text "cm"
    svg.appendChild(
      createSvgEl("text", {
        x: 15,
        y: 60,
        "font-size": 20,
        fill: "black",
      })
    ).textContent = "cm";

    // Major ticks (1 inch)
    for (let i = 0; i <= 12; i++) {
      const x = 10 + i * 72;
      svg.appendChild(
        createSvgEl("path", {
          d: `M${x},0v144`,
          stroke: "black",
          "stroke-width": 1,
        })
      );

      svg.appendChild(
        createSvgEl("text", {
          x: x - 4,
          y: 154,
          "font-size": 12,
          "font-family": "monospace",
          "font-weight": "bold",
          fill: "black",
          "text-anchor": i === 12 ? "end" : "start",
        })
      ).textContent = i;
    }

    // Half-inch ticks
    for (let i = 1; i <= 23; i += 2) {
      const x = 46 + (i - 1) * 36;
      svg.appendChild(
        createSvgEl("path", {
          d: `M${x},0v72`,
          stroke: "black",
          "stroke-width": 1,
        })
      );
    }

    // Quarter-inch ticks
    for (let i = 1; i <= 47; i += 2) {
      const x = 28 + (i - 1) * 18;
      svg.appendChild(
        createSvgEl("path", {
          d: `M${x},0v36`,
          stroke: "black",
          "stroke-width": 1,
        })
      );
    }

    // Eighth-inch ticks
    for (let i = 1; i <= 95; i += 2) {
      const x = 19 + (i - 1) * 9;
      svg.appendChild(
        createSvgEl("path", {
          d: `M${x},0v18`,
          stroke: "black",
          "stroke-width": 1,
        })
      );
    }
  }

  // Call function
  generateRuler("ruler");
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
