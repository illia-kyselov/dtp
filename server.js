const express = require("express");
const { Client } = require("pg");

const app = express();
const port = 5500;

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "mydatabase",
  password: "postgres",
  port: 5432,
});

client.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/places", (req, res) => {
  const searchQuery = req.query.search || "";

  let query = "SELECT * FROM places";
  let values = [];

  if (searchQuery) {
    query += " WHERE name ILIKE $1 OR description ILIKE $1";
    values = [`%${searchQuery}%`];
  }

  client.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred" });
      return;
    }

    const rows = result.rows;
    res.json(rows);
  });
});

app.post("/places", (req, res) => {
  const { name, description, latitude, longitude } = req.body;

  const query =
    "INSERT INTO places (name, description, latitude, longitude, createdate) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  const values = [
    name,
    description,
    latitude,
    longitude,
    new Date().toISOString().slice(0, 10),
  ];

  client.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred" });
      return;
    }

    const newPlace = result.rows[0];

    const historyQuery =
      "INSERT INTO history (name, action, timestamp) VALUES ($1, $2, $3)";
    const historyValues = [
      newPlace.name,
      "Created",
      new Date().toLocaleDateString("uk-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Europe/Kiev",
      }),
    ];

    client.query(historyQuery, historyValues, (err, result) => {
      if (err) {
        console.error(err);
      }

      res.json(newPlace);
    });
  });
});

app.get("/history", (req, res) => {
  const sortColumn = req.query.sort || "id";
  const sortOrder = req.query.order || "asc";

  const query = `SELECT * FROM history ORDER BY ${sortColumn} ${sortOrder}`;

  client.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred" });
      return;
    }

    const rows = result.rows;
    res.json(rows);
  });
});

app.delete("/places/:id", (req, res) => {
  const placeId = req.params.id;
  const query = "DELETE FROM places WHERE id = $1 RETURNING *";
  const values = [placeId];

  client.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred" });
      return;
    }

    const deletedPlace = result.rows[0];

    const historyQuery =
      "INSERT INTO history (name, action, timestamp) VALUES ($1, $2, $3)";
    const historyValues = [
      deletedPlace.name,
      "Deleted",
      new Date().toLocaleDateString("uk-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Europe/Kiev",
      }),
    ];

    client.query(historyQuery, historyValues, (err, result) => {
      if (err) {
        console.error(err);
      }
    });

    res.sendStatus(204);
  });
});

app.put("/places/:id", (req, res) => {
  const placeId = req.params.id;
  const { latitude, longitude } = req.body;

  const query = "UPDATE places SET latitude = $1, longitude = $2 WHERE id = $3";
  const values = [latitude, longitude, placeId];

  client.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred" });
      return;
    }

    res.json({ message: "Marker coordinates updated" });
  });
});

app.post("/history", (req, res) => {
  const { name, action, timestamp } = req.body;

  const query =
    "INSERT INTO history (name, action, timestamp) VALUES ($1, $2, $3) RETURNING *";
  const values = [name, action, timestamp];

  client.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred" });
      return;
    }

    const newEvent = result.rows[0];
    res.json(newEvent);
  });
});

app.use(express.static(__dirname + "/"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
