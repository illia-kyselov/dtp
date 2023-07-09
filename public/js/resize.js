function makeResizable(element) {
  const handle = document.createElement("div");
  handle.classList.add("resize-handle");
  element.appendChild(handle);

  handle.addEventListener("mousedown", startResize, false);

  let startX;
  let startY;
  let startWidth;
  let startHeight;

  function startResize(e) {
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(
      document.defaultView.getComputedStyle(element).width,
      10
    );
    startHeight = parseInt(
      document.defaultView.getComputedStyle(element).height,
      10
    );
    document.documentElement.addEventListener("mousemove", resize, false);
    document.documentElement.addEventListener("mouseup", stopResize, false);
  }

  function resize(e) {
    const width = startWidth + e.clientX - startX;
    const height = startHeight + e.clientY - startY;
    element.style.width = width + "px";
    element.style.height = height + "px";
  }

  function stopResize() {
    document.documentElement.removeEventListener("mousemove", resize, false);
    document.documentElement.removeEventListener("mouseup", stopResize, false);
  }
}

makeResizable(mapContainer);
makeResizable(form);
makeResizable(table);
makeResizable(historyTable);
makeResizable(tableContainer);