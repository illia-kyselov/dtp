const placesTable = document.querySelector("#placesTable");
const tableHeaders = placesTable.querySelectorAll("th");
const placesTableBody = placesTable.querySelector("tbody");

const headersArray = Array.from(tableHeaders);

function getColumnData(columnIndex) {
  const rows = Array.from(placesTableBody.getElementsByTagName("tr"));
  const columnData = [];

  rows.forEach(function (row) {
    const cells = Array.from(row.getElementsByTagName("td"));
    const cellData = cells[columnIndex].textContent.trim();
    columnData.push(cellData);
  });

  return columnData;
}

function sortTableByColumn(columnIndex, sortOrder) {
  const rows = Array.from(placesTableBody.getElementsByTagName("tr"));
  const sortedRows = [];

  rows.forEach(function (row) {
    const cells = Array.from(row.getElementsByTagName("td"));
    const rowData = cells.map((cell) => cell.textContent.trim());
    sortedRows.push({ row, data: rowData });
  });

  sortedRows.sort(function (rowA, rowB) {
    const dataA = rowA.data[columnIndex];
    const dataB = rowB.data[columnIndex];

    if (columnIndex === 0 || columnIndex === 2) {
      if (sortOrder === "asc") {
        return dataA.localeCompare(dataB, undefined, { numeric: true });
      } else {
        return dataB.localeCompare(dataA, undefined, { numeric: true });
      }
    } else {
      if (sortOrder === "asc") {
        return dataA.localeCompare(dataB);
      } else {
        return dataB.localeCompare(dataA);
      }
    }
  });

  while (placesTableBody.firstChild) {
    placesTableBody.firstChild.remove();
  }

  sortedRows.forEach(function (sortedRow) {
    placesTableBody.appendChild(sortedRow.row);
  });
}

headersArray.forEach(function (header, index) {
  header.addEventListener("click", function () {
    const sortOrder = header.getAttribute("data-sort-order") || "asc";

    headersArray.forEach(function (h) {
      if (h !== header) {
        h.classList.remove("asc", "desc");
      }
    });

    if (sortOrder === "asc") {
      header.setAttribute("data-sort-order", "desc");
      header.classList.remove("asc");
      header.classList.add("desc");
    } else {
      header.setAttribute("data-sort-order", "asc");
      header.classList.remove("desc");
      header.classList.add("asc");
    }

    sortTableByColumn(index, sortOrder);
  });
});
