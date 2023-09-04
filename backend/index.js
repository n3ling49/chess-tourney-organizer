const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const port = 5000;

const swiss = require("./swiss");

const registerRoute = require("./routes/register-route");

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect("mongodb://localhost:27019/chesstourney")
  .then(() => {console.log("Connected to MongoDB")})
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.use("/api/register", registerRoute);

app.get("/standings", (req, res) => {
  const standings = swiss.sortPlayers();

  res.send(JSON.stringify(standings));
});

app.get("/rounds", (req, res) => {
  const rounds = swiss.rounds;
  res.send(JSON.stringify(rounds));
});

app.get("/players", (req, res) => {
  const players = swiss.players;
  res.send(JSON.stringify(players));
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
