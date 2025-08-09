export function CustomMainMenu(canvas, menu) {
  // Set position
  menu.style.right = "10px";
  menu.style.top = "10px";
  menu.style.display = "block";

  canvas.upperCanvasEl.oncontextmenu = function (e) {
    e.preventDefault();
    return false;
  };
}
