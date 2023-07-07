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

    var markers = [];
    let currentMarker = null;

    function addMarkerToMap(event) {
      const { lat, lng } = event.latlng;

      if (currentMarker) {
        map.removeLayer(currentMarker);
      }

      const newMarker = L.marker([lat, lng], {
        draggable: true,
        placeId: null,
      }).addTo(map);

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

        if (place.id) {
          updateMarkerCoordinates(place.id, lat, lng);
        } else {
          addMarkerToDatabase(place, lat, lng);
        }

        map.closePopup();
      });

      newMarker.bindPopup(form).openPopup();

      newMarker.on("dragend", function (event) {
        const { lat, lng } = event.target.getLatLng();
        const placeId = event.target.options.placeId;

        if (placeId) {
          updateMarkerCoordinates(placeId, lat, lng);
        } else {
          newMarker.options.latitude = lat;
          newMarker.options.longitude = lng;
        }
      });

      markers.push(newMarker);

      currentMarker = newMarker;
    }

    map.on("click", addMarkerToMap);

    places.forEach(function (place) {
      var marker = L.marker([place.latitude, place.longitude], {
        placeId: place.id,
        draggable: true,
      }).addTo(map);
      marker.bindPopup("<b>" + place.name + "</b><br>" + place.description);

      marker.on("dragend", function (event) {
        const { lat, lng } = event.target.getLatLng();
        const placeId = event.target.options.placeId;
        updateMarkerCoordinates(placeId, lat, lng);
      });

      markers.push(marker);
    });

    function updateMarkerCoordinates(placeId, newLatitude, newLongitude) {
      const updateData = {
        latitude: newLatitude,
        longitude: newLongitude,
      };

      fetch(`/places/${placeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })
        .then(function (response) {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Error updating marker coordinates");
        })
        .then(function (data) {
          console.log(data);
          const place = places.find((p) => p.id === placeId);
          if (place) {
            updateHistory(place.name);
          }
          location.reload();
        })
        .catch(function (error) {
          console.error("An error occurred:", error);
        });
    }

    function updateHistory(name) {
      const updateData = {
        name: name,
        action: "Updated",
        timestamp: new Date().toLocaleString("uk-UA", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Europe/Kiev",
        }),
      };

      fetch(`/history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })
        .then(function (response) {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Error updating history");
        })
        .then(function (data) {
          console.log(data);
        })
        .catch(function (error) {
          console.error("An error occurred:", error);
        });
    }
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

function addMarkerToDatabase(place, latitude, longitude) {
  fetch("/places", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: place.name,
      description: place.description,
      latitude: latitude,
      longitude: longitude,
    }),
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
}
