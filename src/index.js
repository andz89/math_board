import "./style.css";
import {
  Canvas,
  Rect,
  Textbox,
  Image as FabricImage,
  loadSVGFromString,
  util,
} from "fabric";

// Create canvas and set it to full screen
const canvasEl = document.getElementById("c");
canvasEl.width = window.innerWidth;
canvasEl.height = window.innerHeight;

const canvas = new Canvas(canvasEl, {
  preserveObjectStacking: true,
});
canvas.defaultCursor = "grab"; // default when not interacting
canvas.hoverCursor = "grab"; // when hovering over selectable objects
canvas.moveCursor = "grabbing";
canvas.selectionColor = "rgba(100, 100, 255, 0.3)";
canvas.selectionBorderColor = "blue";
canvas.selectionLineWidth = 2;

canvas.upperCanvasEl.oncontextmenu = function (e) {
  e.preventDefault();
  return false;
};
const menu = document.getElementById("customMenu");

canvas.upperCanvasEl.addEventListener("contextmenu", (e) => {
  e.preventDefault();

  const menuWidth = 230;
  const menuHeight = 100; // Approx height – adjust if needed
  const offsetX = 10;
  const offsetY = 10;

  const canvasRect = canvas.upperCanvasEl.getBoundingClientRect();
  let left = e.clientX + offsetX + 20;
  let top = e.clientY - offsetY;

  // Flip horizontally if it goes beyond the canvas width
  if (left + menuWidth > canvasRect.right) {
    left = e.clientX - menuWidth - offsetX - 60;
  }

  // Flip vertically if it goes beyond the canvas height
  if (top + menuHeight > canvasRect.bottom) {
    top = e.clientY - menuHeight - offsetY;
  }

  // Set position
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  menu.style.display = "block";
  // Hide the modal on left click anywhere
  canvas.upperCanvasEl.addEventListener("click", () => {
    menu.style.display = "none";
  });
});

let isDraggingSVG = false;
let tempObject = null;

// Mouse down on a draggable symbol
document.querySelectorAll(".draggable-symbol").forEach((el) => {
  el.addEventListener("mousedown", async (e) => {
    e.preventDefault();
    document.querySelector("#customMenu").style.zIndex = "0";
    const svgEl = el.querySelector("svg");

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
      evented: false,
      hasBorders: false, // Hides border
      hasControls: false, // Hides resizing/rotation controls
      hoverCursor: "grab",
    });
    // ✅ Check for ID
    if (svgEl.id === "long_division_symbol") {
      // group.scaleToWidth(180);
    } else if (svgEl.id === "dot") {
      group.scaleToWidth(10);
    } else {
      group.scaleToWidth(40);
    }

    changeStyleControl(group);
    removeControl(group);

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
const removeControl = (obj) => {
  obj.setControlsVisibility({
    mt: false, // middle top
    mb: false, // middle bottom
    mtr: false, // rotation
    ml: false,
    mr: false,
    tl: false, // top-left
    tr: false, // top-right
    br: false, // bottom-right
    bl: false, // bottom-left
  });
};

const changeStyleControl = (obj) => {
  Object.assign(obj, {
    transparentCorners: false,
    cornerColor: "black",
    cornerStyle: "circle",
    cornerSize: 12,
  });
};
// Make canvas responsive on resize
window.addEventListener("resize", () => {
  canvas.setWidth(window.innerWidth);
  canvas.setHeight(window.innerHeight);
  canvas.renderAll();
});

canvas.on("selection:created", (e) => {
  const activeSelection =
    e.selected.length > 1 ? canvas.getActiveObject() : null;

  if (activeSelection && activeSelection.type === "activeselection") {
    activeSelection.set({
      cornerColor: "#33333",
      cornerStrokeColor: "black",
      borderColor: "#33333",
      cornerSize: 11,
      transparentCorners: false,
      cornerStyle: "circle",
    });
    removeControl(activeSelection);
    canvas.requestRenderAll();
  }
});

canvas.on("mouse:wheel", (opt) => {
  const delta = opt.e.deltaY;
  let zoom = canvas.getZoom();

  // Adjust zoom factor
  zoom *= 0.999 ** delta;

  // Limit zoom range
  zoom = Math.max(0.1, Math.min(zoom, 10));

  // Get mouse pointer position
  const pointer = canvas.getPointer(opt.e);

  // Zoom to point under mouse
  canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);

  opt.e.preventDefault();
  opt.e.stopPropagation();
});

const dragElement = (element, handle) => {
  let posX = 0,
    posY = 0,
    mouseX = 0,
    mouseY = 0;

  handle.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    mouseX = e.clientX;
    mouseY = e.clientY;

    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    posX = mouseX - e.clientX;
    posY = mouseY - e.clientY;
    mouseX = e.clientX;
    mouseY = e.clientY;

    element.style.top = element.offsetTop - posY + "px";
    element.style.left = element.offsetLeft - posX + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
};

// Call it

const header = document.getElementById("customMenuHeader");

dragElement(menu, header);

// PAN SETTINGS
let isSpacePressed = false;
let isDragging = false;
let lastPosX = 0;
let lastPosY = 0;

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    isSpacePressed = true;
    canvas.defaultCursor = "grab";
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "Space") {
    isSpacePressed = false;
    canvas.defaultCursor = "default";
  }
});

canvas.on("mouse:down", function (opt) {
  if (isSpacePressed) {
    isDragging = true;
    canvas.selection = false;
    lastPosX = opt.e.clientX;
    lastPosY = opt.e.clientY;
  }
});

canvas.on("mouse:move", function (opt) {
  if (isDragging) {
    let e = opt.e;
    let vpt = canvas.viewportTransform;
    vpt[4] += e.clientX - lastPosX;
    vpt[5] += e.clientY - lastPosY;
    canvas.requestRenderAll();
    lastPosX = e.clientX;
    lastPosY = e.clientY;
  }
});

canvas.on("mouse:up", function (opt) {
  isDragging = false;
  canvas.selection = true;
});

// ZOOM SETTINGS (mouse wheel zoom centered on cursor)
canvas.on("mouse:wheel", function (opt) {
  let delta = opt.e.deltaY;
  let zoom = canvas.getZoom();
  zoom *= 0.999 ** delta;

  if (zoom > 3) zoom = 3;
  if (zoom < 0.5) zoom = 0.5;

  canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
});
let draggedObject = null;

canvas.on("object:moving", (e) => {
  draggedObject = e.target; // Keep track of the object being moved
  if (!draggedObject) return;

  const pointer = e.e; // Get raw mouse event

  const clientX = pointer.clientX;

  // Check if mouse pointer is outside the visible browser window

  if (clientX < 30) {
    console.log("delete");
  } else {
    console.log("no delete");
  }
});

canvas.on("mouse:up", (e) => {
  if (!draggedObject) return;

  const pointer = e.e; // Get raw mouse event

  const clientX = pointer.clientX;
  const clientY = pointer.clientY;

  // Check if mouse pointer is outside the visible browser window

  if (clientX < 30) {
    canvas.remove(draggedObject);
    canvas.requestRenderAll();
  }

  draggedObject = null; // Reset
});
