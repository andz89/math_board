import {
  Object as FabricObject,
  Canvas,
  Rect,
  Textbox,
  Image as FabricImage,
  loadSVGFromString,
  util,
  Color,
  Control,
  controlsUtils,
} from "fabric";
import {
  shapesConfig,
  textConfig,
  rectConfig,
  measurementConfig,
  divisionSymbol,
} from "./Config.js";
export function DragCreate(canvas, removeControl, changeStyleControl) {
  let isDraggingSVG = false;
  let tempObject = null;

  // Mouse down on a draggable symbol
  document.querySelectorAll(".draggable-symbol").forEach((el) => {
    el.addEventListener("mousedown", async (e) => {
      e.preventDefault();
      document.querySelector("#customMenu").style.zIndex = "0";
      document.querySelector("#customMenu").style.opacity = "0.70";

      var svgEl = el.querySelector("svg")
        ? el.querySelector("svg")
        : el.querySelector("g");

      // if (svgEl.id === "long_division_symbol_visible") {
      //   svgEl = document.querySelector("#long_division_symbol");
      // }
      if (!svgEl) return;

      const svgHTML = svgEl.parentElement.outerHTML;

      const { objects, options } = await loadSVGFromString(svgHTML);
      const group = util.groupSVGElements(objects, options);

      const pointer = canvas.getPointer(e);
      group.set({
        left: pointer.x,
        top: pointer.y,
        originX: "center",
        originY: "center",
        selectable: false,

        evented: false,
        hasBorders: false, // Hides border

        // hasControls: false, // Hides resizing/rotation controls
        hoverCursor: "grab",
      });
      changeStyleControl(group);
      removeControl(group);
      // ✅ Check for ID
      if (svgEl.id === "parenOpen" || svgEl.id === "parenClose") {
        group.scaleToWidth(28);
      } else if (svgEl.id === "dot") {
        group.scaleToWidth(20);
      } else if (svgEl.id === "long_division_symbol") {
        divisionSymbol(group);
      } else if (svgEl.classList.contains("measurement")) {
        measurementConfig(group);
      } else if (svgEl.id === "rectLine") {
        rectConfig(group);
      } else if (svgEl.classList.contains("shapes")) {
        shapesConfig(group);
      } else {
        textConfig(group);
      }

      canvas.add(group);
      canvas.requestRenderAll();

      isDraggingSVG = true;
      tempObject = group;
    });
  });

  // Mouse move on canvas (to follow mouse)
  canvas.upperCanvasEl.addEventListener("mousemove", (e) => {
    if (!isDraggingSVG || !tempObject) return;

    const pointer = canvas.getPointer(e);
    tempObject.set({
      left: pointer.x,
      top: pointer.y,
    });
    canvas.requestRenderAll();
  });

  canvas.upperCanvasEl.addEventListener("mouseup", () => {
    if (!isDraggingSVG || !tempObject) return;
    document.querySelector("#customMenu").style.zIndex = "999999";
    document.querySelector("#customMenu").style.opacity = "1";

    // Restore object interactivity
    tempObject.set({
      selectable: true,
      evented: true,
    });

    isDraggingSVG = false;
    // tempObject = null;
    canvas.setActiveObject(tempObject);
    // tempObject.setCoords();
    canvas.requestRenderAll();
  });
}
