document
  .getElementById("newPlaceForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var name = document.getElementsByName("name")[0].value;
    var description = document.getElementsByName("description")[0].value;
    var latitude = parseFloat(document.getElementsByName("latitude")[0].value);
    var longitude = parseFloat(
      document.getElementsByName("longitude")[0].value
    );
    var createdate = new Date().toISOString().slice(0, 10);

    fetch("/places", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        description: description,
        latitude: latitude,
        longitude: longitude,
        createdate: createdate,
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        document.getElementById("newPlaceForm").reset();
        fetchPlaces();
        location.reload();
      })
      .catch(function (error) {
        console.error("An error occurred:", error);
      });
  });
