import { Line, Control, controlsUtils } from "fabric";

export const removeControl = (obj) => {
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
export const changeStyleControl = (obj) => {
  Object.assign(obj, {
    transparentCorners: false,
    cornerColor: "black",
    cornerStyle: "circle",
    cornerSize: 12,
  });
};

export function dragElement(menu, handle, canvas, state) {
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

    menu.style.top = menu.offsetTop - posY + "px";
    menu.style.left = menu.offsetLeft - posX + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

export function dragCanvas(canvas) {
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
}
export function zoomCanvas(canvas, drawGrid) {
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
}
export const mouseWheel = (canvas) => {
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
};

export function deleteObject(canvas) {
  let draggedObject = null;

  canvas.on("object:moving", (e) => {
    draggedObject = e.target; // Keep track of the object being moved
    if (!draggedObject) return;

    const pointer = e.e; // Get raw mouse event

    const clientX = pointer.clientX;
    const clientY = pointer.clientY;
    // Check if mouse pointer is outside the visible browser window

    if (clientY < 30) {
      document.querySelector(".delete-item-alert").classList.remove("hidden");
    } else {
      // console.log("no delete");
      document.querySelector(".delete-item-alert").classList.add("hidden");
    }
  });

  canvas.on("mouse:up", (e) => {
    if (!draggedObject) return;

    const pointer = e.e; // Get raw mouse event

    const clientX = pointer.clientX;
    const clientY = pointer.clientY;

    // Check if mouse pointer is outside the visible browser window
    console.log(window.innerWidth);
    console.log(clientX);
    if (clientY < 30) {
      document.querySelector(".delete-item-alert").classList.add("hidden");

      if (draggedObject && draggedObject.type === "activeselection") {
        draggedObject.forEachObject((obj) => {
          canvas.remove(obj); // remove each selected object
        });
      } else {
        canvas.remove(draggedObject);
      }
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    }

    draggedObject = null; // Reset
  });
}

export const multipleSelectionStyle = (canvas, removeControl) => {
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
      activeSelection.hasControls = true;
      activeSelection.cornerColor = "teal";
      activeSelection.opacity = 0.9; // Slightly transparent
      activeSelection.setControlsVisibility({
        mtr: true, // middle-top

        tr: true, // top-right
      });
      // Override mtr control with custom render
      activeSelection.controls.mtr = new Control({
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

      canvas.requestRenderAll();
    }
  });
};
export function drawGrid(canvas, gridSize = 50) {
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

// Detect double-click
export function doubleClickObj(canvas) {
  canvas.on("mouse:dblclick", (e) => {
    const target = e.target;

    if ((target && target.type === "text") || target.type === "circle") {
      // Example: change fill of first path in the SVG

      if (target.fill === "red") {
        target.set("fill", "#222");
      } else {
        target.set("fill", "red");
      }
      canvas.requestRenderAll();
    }
  });
}
