function saveElementLayout(element) {
  const layout = {
    width: element.style.width,
    height: element.style.height,
    top: element.style.top,
    left: element.style.left,
  };
  localStorage.setItem(element.id, JSON.stringify(layout));
}

function restoreElementLayout(element) {
  const layoutJSON = localStorage.getItem(element.id);
  if (layoutJSON) {
    const layout = JSON.parse(layoutJSON);
    element.style.width = layout.width;
    element.style.height = layout.height;
    element.style.top = layout.top;
    element.style.left = layout.left;
  }
}

makeResizable(mapContainer);
makeResizable(form);
makeResizable(table);
makeResizable(historyTable);
makeResizable(tableContainer);

window.addEventListener("beforeunload", function () {
  saveElementLayout(mapContainer);
  saveElementLayout(form);
  saveElementLayout(table);
  saveElementLayout(historyTable);
  saveElementLayout(tableContainer);
});

window.addEventListener("load", function () {
  restoreElementLayout(mapContainer);
  restoreElementLayout(form);
  restoreElementLayout(table);
  restoreElementLayout(historyTable);
  restoreElementLayout(tableContainer);
});
