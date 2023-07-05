fetch("/places")
  .then(function (response) {
    return response.json();
  })
  .then(function (places) {
    var map = L.map("map").setView([49.0269, 31.4822], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    var marker;

    function addMarkerToMap(event) {
      const { lat, lng } = event.latlng;

      if (marker) {
        map.removeLayer(marker);
      }

      marker = L.marker([lat, lng]).addTo(map);

      marker.on("click", function () {
        const form = document.createElement("form");
        form.innerHTML = `
          <input type="text" class="form-field" name="name" placeholder="Назва" required />
          <input type="text" class="form-field" name="description" placeholder="Опис" required />
          <input type="number" name="latitude" value="${lat.toFixed(
            6
          )}" step="any" hidden />
          <input type="number" name="longitude" value="${lng.toFixed(
            6
          )}" step="any" hidden />
          <input type="date" name="createdate" value="${new Date().toLocaleDateString()}" hidden/>
          <button type="submit" class="button">Додати</button>
        `;

        form.addEventListener("submit", function (event) {
          event.preventDefault();

          const formData = new FormData(form);
          const place = Object.fromEntries(formData.entries());

          addPlaceToTable(place);

          fetch("/places", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(place),
          })
            .then(function (response) {
              if (response.ok) {
                return response.json();
              }
              throw new Error("Error adding place");
            })
            .then(function (data) {
              console.log(data);
              location.reload();
            })
            .catch(function (error) {
              console.error("An error occurred:", error);
            });

          map.closePopup();
          map.removeLayer(marker);
          marker = null;
        });

        marker.bindPopup(form).openPopup();
      });
    }

    map.on("click", addMarkerToMap);

    places.forEach(function (place) {
      var marker = L.marker([place.latitude, place.longitude]).addTo(map);
      marker.bindPopup("<b>" + place.name + "</b><br>" + place.description);
    });
  })
  .catch(function (error) {
    console.error("An error occurred:", error);
  });

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

function addPlaceToTable(place) {
  const row = document.createElement("tr");
  row.setAttribute("data-id", place.id);
  row.innerHTML = `
  <td>${place.id}</td>
  <td>${place.name}</td>
  <td>${place.description}</td>
  <td>${place.latitude}</td>
  <td>${place.longitude}</td>
  <td>${new Date(place.createdate).toLocaleDateString("uk-UA")}</td>
  <td><button class="delete-icon" data-id="${place.id}">Delete</button></td>
`;

  placesTableBody.appendChild(row);
}

function clearPlacesTable() {
  placesTableBody.innerHTML = "";
}

function fetchPlaces(sortColumn = "id", sortOrder = "asc") {
  const searchQuery = searchInput.value.trim();

  const sortParam = `sort=${sortColumn}&order=${sortOrder}`;

  let fetchUrl = `/places?${sortParam}`;
  if (searchQuery) {
    fetchUrl += `&search=${encodeURIComponent(searchQuery)}`;
  }

  const deletedPlaceId = localStorage.getItem("deletedPlaceId");
  if (deletedPlaceId) {
    fetch(`/places/${deletedPlaceId}`)
      .then(function (response) {
        return response.json();
      })
      .catch(function (error) {
        console.error("An error occurred:", error);
      });

    localStorage.removeItem("deletedPlaceId");
  }

  fetch(fetchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (places) {
      clearPlacesTable();
      places.forEach(function (place) {
        addPlaceToTable(place);
      });
    })
    .catch(function (error) {
      console.error("An error occurred:", error);
    });
}

searchButton.addEventListener("click", function () {
  const searchQuery = searchInput.value.trim();

  fetch(`/places?search=${encodeURIComponent(searchQuery)}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (places) {
      clearPlacesTable();
      places.forEach(function (place) {
        addPlaceToTable(place);
      });
    })
    .catch(function (error) {
      console.error("An error occurred:", error);
    });
});

fetchPlaces();

function deletePlaceFromTable(event) {
  const deleteButton = event.target;
  const row = deleteButton.closest("tr");
  if (row) {
    const placeId = row.getAttribute("data-id");

    fetch(`/places/${placeId}`, {
      method: "DELETE",
    })
      .then(function (response) {
        if (response.ok) {
          row.remove();
        } else {
          throw new Error("Error: " + response.status);
        }
      })
      .then(function () {
        fetchPlaces();
        location.reload();
      })
      .catch(function (error) {
        console.error("An error occurred:", error);
      });
  }
}

document
  .querySelector("#placesTable tbody")
  .addEventListener("click", function (event) {
    if (event.target && event.target.classList.contains("delete-icon")) {
      deletePlaceFromTable(event);
    }
  });

function fetchHistory() {
  fetch("/history")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Error fetching history");
      }
      return response.json();
    })
    .then(function (history) {
      history.forEach(function (event) {
        addEventToHistoryTable(event);
      });
    })
    .catch(function (error) {
      console.error("An error occurred:", error);
    });
}

window.addEventListener("load", function () {
  fetchHistory();
});

function addEventToHistoryTable(event) {
  const row = document.createElement("tr");
  const formattedTimestamp = new Date(event.timestamp).toLocaleString("uk-UA");
  row.innerHTML = `
    <td>${event.id}</td>
    <td>${event.name}</td>
    <td>${event.action}</td>
    <td>${formattedTimestamp}</td>
  `;
  historyTableBody.appendChild(row);
}

function addEventToHistory(id, name, action) {
  const event = {
    id: id,
    name: name,
    action: action,
    timestamp: new Date().toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Europe/Kiev",
    }),
  };

  addEventToHistoryTable(event);

  fetch("/history", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Error adding event");
      }
    })
    .catch(function (error) {
      console.error("An error occurred:", error);
    });
}
