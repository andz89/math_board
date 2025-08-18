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

export function divisionSymbol(group) {
  (group.perPixelTargetFind = true), // click detection checks transparency
    group.scaleToWidth(290);
}
export function measurementConfig(group) {
  group.hasControls = true;
  group.cornerColor = "teal";
  group.opacity = 0.9; // Slightly transparent
  group.setControlsVisibility({
    mtr: true, // middle-top
    tl: false, // top-left
    tr: true, // top-right
    br: false, // bottom-right
    bl: false, // bottom-left

    mt: false, // middle top
  });

  // Override mtr control with custom render
  group.controls.mtr = new Control({
    x: 0,
    y: 0, // 🎯 0 means middle (vertically centered)
    offsetY: 0,
    actionHandler: controlsUtils.rotationWithSnapping,
    cursorStyleHandler: controlsUtils.rotationStyleHandler,
    withConnection: true,
    actionName: "rotate",
    render: function (ctx, left, top) {
      ctx.save();
      ctx.fillStyle = "gray";
      ctx.beginPath();
      ctx.arc(left, top, 10, 0, Math.PI * 2);
      ctx.fill();

      // Draw reset symbol (↺)
      ctx.fillStyle = "white";
      ctx.font = "19px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("↻", left, top + 1);
      ctx.restore();
    },
  });
  group.controls.horizontalPosition = new Control({
    x: 0.06,
    y: 0, // 🎯 0 means middle (vertically centered)

    offsetY: 1,
    cursorStyle: "pointer",
    mouseUpHandler: function (eventData, transform) {
      const target = transform.target;
      target.set("angle", 0); // reset angle to horizontal
      target.setCoords(); // update object coordinates
      target.canvas.requestRenderAll(); // redraw canvas
      return true;
    },
    render: function (ctx, left, top) {
      ctx.save();
      ctx.fillStyle = "gray";
      ctx.beginPath();
      ctx.arc(left, top, 10, 0, Math.PI * 2);
      ctx.fill();

      // Draw reset symbol (↺)
      ctx.fillStyle = "white";
      ctx.font = "19px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("⚊", left, top + 1);
      ctx.restore();
    },
  });
  group.controls.verticalPosition = new Control({
    x: 0.12,
    y: 0, // 🎯 0 means middle (vertically centered)

    offsetY: 1,
    cursorStyle: "pointer",
    mouseUpHandler: function (eventData, transform) {
      const target = transform.target;
      target.set("angle", 90); // reset angle to horizontal
      target.setCoords(); // update object coordinates
      target.canvas.requestRenderAll(); // redraw canvas
      return true;
    },
    render: function (ctx, left, top) {
      ctx.save();
      ctx.fillStyle = "gray";
      ctx.beginPath();
      ctx.arc(left, top, 10, 0, Math.PI * 2);
      ctx.fill();

      // Draw reset symbol (↺)
      ctx.fillStyle = "white";
      ctx.font = "19px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("❘", left, top + 1);
      ctx.restore();
    },
  });
  group.controls.layerUp = new Control({
    x: 0.18,
    y: 0, // 🎯 0 means middle (vertically centered)

    offsetY: 1,
    cursorStyle: "pointer",
    mouseUpHandler: function (eventData, transform) {
      const target = transform.target;
      const canvas = target.canvas;

      if (!canvas) return false;

      // Safe way: remove & re-add at top index
      canvas.remove(target);
      canvas.add(target);

      target.setCoords(); // update object boundaries
      canvas.requestRenderAll(); // force redraw

      return true;
    },
    render: function (ctx, left, top) {
      ctx.save();
      ctx.fillStyle = "gray";
      ctx.beginPath();
      ctx.arc(left, top, 10, 0, Math.PI * 2);
      ctx.fill();

      // Draw reset symbol (↺)
      ctx.fillStyle = "white";
      ctx.font = "19px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("↥", left, top + 1);
      ctx.restore();
    },
  });
  group.scaleToWidth(490);
}
export function textConfig(group) {
  group.hasControls = true;
  group.cornerColor = "teal";
  // group.opacity = 0.9; // Slightly transparent
  group.setControlsVisibility({
    tr: true, // top-right
  });
  group.scaleToWidth(60);
  group.scaleToHeight(60);
}
export function unitsConfig(group) {
  group.hasControls = true;
  group.cornerColor = "teal";
  // group.opacity = 0.9; // Slightly transparent
  group.setControlsVisibility({
    tr: true, // top-right
  });
  group.scaleToWidth(40);
  group.scaleToHeight(40);
}
export function rectConfig(group) {
  group.scaleToWidth(170);
  group.hasControls = true;
  group.cornerColor = "teal";

  group.setControlsVisibility({
    ml: true,
    mr: true,
  });
}
export function shapesConfig(group) {
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
  group.strokeWidth = 1;

  // Override mtr control with custom render
  group.controls.mtr = new Control({
    x: 0,
    y: -0.9, // 🎯 0 means middle (vertically centered)
    offsetY: 0,
    actionHandler: controlsUtils.rotationWithSnapping,
    cursorStyleHandler: controlsUtils.rotationStyleHandler,
    withConnection: true,
    actionName: "rotate",
    render: function (ctx, left, top) {
      ctx.save();
      ctx.fillStyle = "gray";
      ctx.beginPath();
      ctx.arc(left, top, 13, 0, Math.PI * 2);
      ctx.fill();

      // Draw reset symbol (↺)
      ctx.fillStyle = "white";
      ctx.font = "19px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("↻", left, top + 1);
      ctx.restore();
    },
  });

  group.scaleToWidth(190);
}
