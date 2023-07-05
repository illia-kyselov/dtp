# Installation instructions:
  1. git clone https://github.com/illia-kyselov/project_map_with_form.git
  2. npm i --legacy-peer-deps
  3. npm start
  4. open in browser http://localhost:5500/ site

# Technologies used:
  1. Node.js
  2. JS
  3. HTML & CSS
  4. Leaflet

# PostgreSQL command:
  CREATE TABLE places (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    latitude FLOAT,
    longitude FLOAT,
    "Date" TIMESTAMP DEFAULT current_timestamp
  );

  CREATE TABLE history (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  action VARCHAR(255),
  timestamp TIMESTAMP
  );

# Places:
  1.	Guliver	This is Guliver	50.442704	30.521950
  2.	Lviv Opera Theater	This is Lviv Opera Theater	49.841895	24.030327
  3.	Odesa Opera House	This is Odesa Opera Theater	46.484840	30.732355
  4.	Yavoriv National Nature Park	This is Yavoriv National Nature Park	49.938601	23.382255
  5.	Kamianets-Podilskyi fortress	This is Kamianets-Podilskyi fortress	48.671934	26.589493
