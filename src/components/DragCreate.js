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

      if (svgEl.id === "long_division_symbol_visible") {
        svgEl = document.querySelector("#long_division_symbol");
      }
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
        group.scaleToWidth(390);
      } else if (svgEl.classList.contains("measurement")) {
        group.hasControls = true;
        group.cornerColor = "teal";

        group.setControlsVisibility({
          mtr: true, // middle-top
          tl: false, // top-left
          tr: true, // top-right
          br: false, // bottom-right
          bl: false, // bottom-left

          mt: false, // middle top
        });
        group.stroke = "black";
        group.strokeWidth = 2;

        // Override mtr control with custom render
        group.controls.mtr = new Control({
          x: 0,
          y: -0.5,
          offsetY: -40,
          actionHandler: controlsUtils.rotationWithSnapping,
          cursorStyleHandler: controlsUtils.rotationStyleHandler,
          withConnection: true,
          actionName: "rotate",
          render: function (ctx, left, top) {
            ctx.save();
            ctx.fillStyle = "red"; // 🎯 only mtr control gets this color
            ctx.beginPath();
            ctx.arc(left, top, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          },
        });
        group.scaleToWidth(490);
      } else if (svgEl.id === "rectLine") {
        group.scaleToWidth(170);
        group.hasControls = true;
        group.cornerColor = "teal";

        group.setControlsVisibility({
          ml: true,
          mr: true,
        });
      } else if (svgEl.classList.contains("shapes")) {
        group.hasControls = true;
        group.cornerColor = "teal";

        group.setControlsVisibility({
          mtr: true, // middle-top
          tl: false, // top-left
          tr: true, // top-right
          br: false, // bottom-right
          bl: false, // bottom-left

          mt: false, // middle top
        });
        group.stroke = "black";
        group.strokeWidth = 2;

        // Override mtr control with custom render
        group.controls.mtr = new Control({
          x: 0,
          y: -0.5,
          offsetY: -40,
          actionHandler: controlsUtils.rotationWithSnapping,
          cursorStyleHandler: controlsUtils.rotationStyleHandler,
          withConnection: true,
          actionName: "rotate",
          render: function (ctx, left, top) {
            ctx.save();
            ctx.fillStyle = "red"; // 🎯 only mtr control gets this color
            ctx.beginPath();
            ctx.arc(left, top, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          },
        });

        group.scaleToWidth(190);
      } else {
        group.scaleToWidth(60);
      }
      // group.cornerColor = "transparent";

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
