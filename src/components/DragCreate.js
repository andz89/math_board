import {
  Object as FabricObject,
  Canvas,
  Rect,
  Textbox,
  Image as FabricImage,
  loadSVGFromString,
  util,
  Color,
} from "fabric";
export function DragCreate(canvas, removeControl, changeStyleControl) {
  let isDraggingSVG = false;
  let tempObject = null;

  // Mouse down on a draggable symbol
  document.querySelectorAll(".draggable-symbol").forEach((el) => {
    el.addEventListener("mousedown", async (e) => {
      e.preventDefault();
      document.querySelector("#customMenu").style.zIndex = "0";
      var svgEl = el.querySelector("svg");

      if (svgEl.id === "long_division_symbol_visible") {
        svgEl = document.querySelector("#long_division_symbol");
      }
      if (!svgEl) return;

      const svgHTML = svgEl.outerHTML;

      const { objects, options } = await loadSVGFromString(svgHTML);
      const group = util.groupSVGElements(objects, options);

      const pointer = canvas.getPointer(e);
      group.set({
        left: pointer.x,
        top: pointer.y,
        originX: "center",
        originY: "center",
        selectable: false,
        perPixelTargetFind: true,
        evented: false,
        hasBorders: false, // Hides border
        hasControls: false, // Hides resizing/rotation controls
        hoverCursor: "grab",
      });

      canvas.requestRenderAll(); // or canvas.renderAll();

      // ✅ Check for ID
      if (svgEl.id === "parentensis_close" || svgEl.id === "parentensis_open") {
        group.scaleToWidth(18);
      } else if (svgEl.id === "dot") {
        group.scaleToWidth(10);
      } else if (svgEl.id === "long_division_symbol") {
        group.scaleToWidth(320);
      } else if (svgEl.id === "rect-line") {
        group.scaleToWidth(200);
      } else {
        group.scaleToWidth(40);
      }

      changeStyleControl(group);
      removeControl(group);

      canvas.add(group);

      if (svgEl.id === "rect-line") {
        group.hasControls = true;
        group.cornerColor = "teal";
        group.setControlsVisibility({
          ml: true,
          mr: true,
        });
      }
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
    // Restore object interactivity
    tempObject.set({
      selectable: true,
      evented: true,
    });

    isDraggingSVG = false;
    // tempObject = null;
    canvas.setActiveObject(tempObject);

    canvas.requestRenderAll();
  });
}
