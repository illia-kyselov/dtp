const express = require("express");
const { Client } = require("pg");

const app = express();
const port = 5500;

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "mydatabase",
  password: "6006059a",
  port: 5432,
});

client.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/places", (req, res) => {
  const query = "SELECT * FROM places";

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

app.use(express.static(__dirname + "/"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post("/places", (req, res) => {
  const { name, description, latitude, longitude } = req.body;
  const query =
    "INSERT INTO places (name, description, latitude, longitude) VALUES ($1, $2, $3, $4)";
  const values = [name, description, latitude, longitude];

  client.query(query, values, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred" });
      return;
    }

    res.json({ message: "Place added successfully" });
  });
});

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* http://127.0.0.1:*"
  );
  next();
});
