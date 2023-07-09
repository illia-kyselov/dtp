let isCtrlPressed = false;

document.addEventListener("keydown", function (event) {
  if (event.key === "Control") {
    isCtrlPressed = true;
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key === "Control") {
    isCtrlPressed = false;
  }
});

function moveBlock(element) {
  element.addEventListener("mousedown", startMove, false);

  let startX;
  let startY;
  let startLeft;
  let startTop;

  function startMove(event) {
    if (!isCtrlPressed) {
      return;
    }

    startX = event.clientX;
    startY = event.clientY;
    startLeft = parseInt(
      document.defaultView.getComputedStyle(element).left,
      10
    );
    startTop = parseInt(document.defaultView.getComputedStyle(element).top, 10);

    document.documentElement.addEventListener("mousemove", move, false);
    document.documentElement.addEventListener("mouseup", stopMove, false);
  }

  function move(event) {
    const diffX = event.clientX - startX;
    const diffY = event.clientY - startY;

    element.style.left = startLeft + diffX + "px";
    element.style.top = startTop + diffY + "px";
  }

  function stopMove() {
    document.documentElement.removeEventListener("mousemove", move, false);
    document.documentElement.removeEventListener("mouseup", stopMove, false);
  }
}

const mapContainer = document.getElementById("mapContainer");
const form = document.getElementById("newPlaceForm");
const table = document.getElementById("placesTable");
const historyTable = document.getElementById("history-container");
const tableContainer = document.getElementById("tableContainer");

moveBlock(mapContainer);
moveBlock(form);
moveBlock(table);
moveBlock(historyTable);
moveBlock(tableContainer);
