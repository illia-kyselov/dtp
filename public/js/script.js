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

    places.forEach(function (place) {
      var marker = L.marker([place.latitude, place.longitude]).addTo(map);
      marker.bindPopup("<b>" + place.name + "</b><br>" + place.description);
    });
  })
  .catch(function (error) {
    console.error("An error occurred:", error);
  });
