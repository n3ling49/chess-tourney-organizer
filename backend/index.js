const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;

const swiss = require("./swiss");

app.use(cors());

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
  console.log(`Example app listening on port ${port}`);
});
