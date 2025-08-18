group.controls.duplicateControl = new Control({
  x: -0.5, // left side
  y: -0.5, // top side
  offsetX: -20,
  offsetY: -20,
  cursorStyle: "pointer",
  mouseUpHandler: function (eventData, transform) {
    const target = transform.target;
    const canvas = target.canvas;

    // clone object
    target.clone(function (clone) {
      clone.set({
        left: target.left + 30,
        top: target.top + 30,
      });
      canvas.add(clone);
      canvas.setActiveObject(clone);
    });

    return true; // required
  },
  render: function (ctx, left, top) {
    ctx.save();
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(left, top, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("+", left, top);
    ctx.restore();
  },
});
