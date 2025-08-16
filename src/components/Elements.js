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

export function mainMenuContent() {
  // Symbol list: we can store text, SVG special cases, or HTML
  const symbols = [
    { type: "text", value: "1" },
    { type: "text", value: "2" },
    { type: "text", value: "3" },
    { type: "text", value: "4" },
    { type: "text", value: "5" },
    { type: "text", value: "6" },
    { type: "text", value: "7" },
    { type: "text", value: "8" },
    { type: "text", value: "9" },
    { type: "text", value: "0" },
    { type: "text", value: "+" },
    { type: "text", value: "-" },
    { type: "text", value: "x" },
    { type: "text", value: "÷", fontSize: 40 },
    { type: "text", value: "=", fontSize: 40 },
    { type: "text", value: "/", fontSize: 38 },
    { type: "dot" },
    { type: "longDivision" },

    { type: "parenOpen" },
    { type: "parenClose" },
    { type: "rectLine" },
  ];

  // Create container

  var numbers_div = document.querySelector("#numbers");

  // Buttons container
  const btnContainer = document.createElement("div");
  btnContainer.className =
    "text-white select-none flex justify-center flex-wrap gap-[3px] cursor-grab mt-3 pb-2";

  // Loop through symbols and create buttons
  symbols.forEach((sym) => {
    const btn = document.createElement("div");
    btn.className =
      "border-1 rounded-md border-[#ccc] draggable-symbol hover:bg-slate-200 shadow-sm";
    btn.setAttribute("draggable", "true");
    btn.dataset.symbol = "1"; // or sym.value if you want it dynamic

    if (sym.type === "text") {
      btn.innerHTML = `
      <svg width="40" height="45">
        <text x="20" y="38" text-anchor="middle" font-size="${
          sym.fontSize || 40
        }" fill="#222" font-family="Arial">
          ${sym.value}
        </text>
      </svg>
    `;
    } else if (sym.type === "dot") {
      btn.innerHTML = `<svg width="40" height="35" id="dot"><circle cx="20" cy="17" r="4" fill="black" /></svg>`;
    } else if (sym.type === "longDivision") {
      btn.innerHTML = `
      <div class="mt-1 w-[40px] h-[30px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" viewBox="0 0 472 454" id="long_division_symbol_visible" >
          <path fill="#111c2d" d="M409,75H144l1,149s2.327,96.8-37,148-46.6,46.8-54,49 29.181-51.265,40-101S104,46,104,46l305-1V75Z"/>
        </svg>
      </div>
      <div class="draggable-symbol hidden">
            <svg width="35" height="35" id="long_division_symbol">
              <line
                x1="6"
                y1="14"
                x2="370"
                y2="14"
                stroke="#000"
                stroke-width="8"
              />
              <line
                class="pb-2"
                x1="10"
                y1="13"
                x2="10"
                y2="105"
                stroke="#000"
                stroke-width="8"
              />
            </svg>
          </div>
    `;
    } else if (sym.type === "parenOpen") {
      btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="35" id="parenOpen">
        <path d="M58.17,16.7c-5.96,8.01-10.3,18.63-10.3,33.42s4.49,25,10.3,33.17h-5.64c-5.15-6.78-10.7-17.24-10.7-33.17.08-16.1,5.56-26.56,10.7-33.42h5.64Z"/>
      </svg>
    `;
    } else if (sym.type === "parenClose") {
      btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="35" id="parenClose">
        <path d="M41.83,16.7c5.96,8.01,10.3,18.63,10.3,33.42s-4.49,25-10.3,33.17h5.64c5.15-6.78,10.7-17.24,10.7-33.17-.08-16.1-5.56-26.56-10.7-33.42h-5.64Z"/>
      </svg>
    `;
    } else if (sym.type === "rectLine") {
      btn.innerHTML = `
      <svg
            xmlns="http://www.w3.org/2000/svg"
            id="rectLine"
          
            viewBox="0 0 89.63 5.4"
            width="40"
            height="35"
          >
            
              <rect width="50" height="3.4" x="20" y="50%" />
            
          </svg>
    `;
    }

    btnContainer.appendChild(btn);
  });

  numbers_div.appendChild(btnContainer);
}
export function createShapesElement() {
  // ---- Group 1 (top row) ----
  const group1 = [
    {
      w: 80,
      h: 50,
      d: "M8.823085463760208,48L50.392304845413264,48L71.17691453623979,12L29.607695154586736,12Z",
      fill: "#0f82f2",
      cls: "parallelogram",
    },
    {
      w: 80,
      h: 50,
      d: "M6.964134322639104,44.304949456302474L73.0358656773609,44.304949456302474L56.51793283868045,15.695050543697526L23.482067161319552,15.695050543697526Z",
      fill: "#eb4726",
    },
    {
      w: 80,
      h: 50,
      d: "M7.80062112400303,13.900310562001515L72.19937887599697,13.900310562001515L72.19937887599697,46.099689437998485L7.80062112400303,46.099689437998485Z",
      fill: "#0f82f2",
      cls: "polygon-tile",
    },
    {
      w: 80,
      h: 80,
      d: "M15.850465843002272,5.850465843002272L64.14953415699773,5.850465843002272L15.850465843002272,54.14953415699773Z",
      fill: "#22ab24",
      cls: "polygon-tile",
    },
    {
      w: 80,
      h: 80,
      d: "M14.059239083575886,15.023094701918813L14.059239083575886,44.976905298081185L65.94076091642411,15.023094701918813Z",
      fill: "#fd8c00",
      cls: "polygon-tile",
    },
    {
      w: 80,
      h: 80,
      d: "M40,11.200000000000003L64.94153162899183,25.6L40,68.8L15.058468371008171,25.6Z",
      fill: "#6d3bbf",
      cls: "polygon-tile",
    },
  ];

  // ---- Group 2 (bottom row) ----
  const group2 = [
    {
      w: 80,
      h: 80,
      d: "M8.823085463760208,67L71.17691453623979,67L40,13Z",
      fill: "#fd8c00",
      cls: "triangle",
    },
    {
      w: 80,
      h: 80,
      d: "M65.4558441227157,65.4558441227157L14.544155877284297,65.4558441227157L14.54415587728429,14.544155877284297L65.4558441227157,14.54415587728429Z",
      fill: "#0f82f2",
      cls: "polygon-tile",
    },
    {
      w: 80,
      h: 80,
      d: "M61.16026908252903,69.1246117974981L18.83973091747097,69.1246117974981L5.761965413374469,28.875388202501895L39.99999999999999,4L74.23803458662553,28.87538820250188Z",
      fill: "#22ab24",
      cls: "shapes",
    },
    {
      w: 80,
      h: 80,
      d: "M57.999999999999986,71.17691453623979L21.999999999999996,71.17691453623978L4.000000000000007,40.00000000000001L22.000000000000018,8.823085463760211L57.99999999999997,8.8230854637602L76,39.99999999999999Z",
      fill: "#cd0e66",
      cls: "polygon-tile",
    },
    {
      w: 80,
      h: 80,
      d: "M55.61981460823209,72.43487924448709L24.38018539176791,72.43487924448709L4.90259516145435,48.01075362242732L11.854066631150925,17.5543671330856L39.99999999999999,4L68.14593336884906,17.554367133085588L75.09740483854566,48.01075362242731Z",
      fill: "#009ea6",
      cls: "polygon-tile",
    },
    {
      w: 80,
      h: 80,
      d: "M53.77660356514323,73.25966317040633L26.22339643485677,73.25966317040633L6.74033682959368,53.77660356514323L6.740336829593673,26.223396434856774L26.223396434856745,6.740336829593687L53.77660356514324,6.74033682959368L73.25966317040631,26.223396434856745L73.25966317040633,53.77660356514324Z",
      fill: "#6d3bbf",
      cls: "polygon-tile",
    },
  ];

  function buildShapeRow(shapes, className) {
    const wrapper = document.createElement("div");
    wrapper.className = className;

    shapes.forEach(({ w, h, d, fill, cls }) => {
      const shell = document.createElement("div");
      shell.className = "draggable-symbol";

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", String(w));
      svg.setAttribute("height", String(h));
      svg.classList.add("shapes");

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("d", d);
      path.setAttribute("fill", fill);
      if (cls) path.setAttribute("class", cls);

      svg.appendChild(path);
      shell.appendChild(svg);
      wrapper.appendChild(shell);
    });

    return wrapper;
  }

  (function renderAll() {
    const container = document.getElementById("shapes");
    if (!container) return;

    // Clear existing
    container.innerHTML = "";

    // Row 1 (top)
    const row1 = buildShapeRow(
      group1,
      "text-white select-none flex flex-wrap justify-evenly gap-3 cursor-grab"
    );
    container.appendChild(row1);

    // Divider
    const hr = document.createElement("hr");
    hr.className = "h-px my-2 bg-gray-200 border-0 dark:bg-gray-700";
    container.appendChild(hr);

    // Row 2 (bottom)
    const row2 = buildShapeRow(
      group2,
      "text-white select-none flex flex-wrap justify-evenly mx-auto cursor-grab mt-0"
    );
    container.appendChild(row2);
  })();
}
