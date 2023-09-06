const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const port = 5000;
const jwt = require("jsonwebtoken");

const PlayerApi = require('./apis/playerApi');

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
  try{
    swiss.sortPlayers().then(
      (standings) => {
        if(!standings) throw Error('Couldn\'t sort players');
        return res.send(JSON.stringify(standings));
      }
    );
  } catch (err) {
    console.error(err);
    res.status(503).json({ message: "Internal server error" });
  }
});

app.get("/rounds", (req, res) => {
  try{
    const rounds = swiss.rounds;
    res.send(JSON.stringify(rounds));
  } catch (err) {
    console.error(err);
    res.status(503).json({ message: "Internal server error" });
  }
});

app.get("/players", (req, res) => {
  try{
    PlayerApi.getPlayers().then(
      (players) => {
        if(!players) throw Error('Couldn\'t get players');
        return res.send(JSON.stringify(players));
      }
    );
  } catch (err) {
    console.error(err);
    res.status(503).json({ message: "Internal server error" });
  }
});

app.get("/api/user/me/id", (req, res) => {
  try{
    const token = req.cookies.session;
    if(!token) return res.status(401).json({ message: "No token" });
    const decodedId = jwt.decode(token, {complete: true})?.payload?.id;
    if(!decodedId) return res.status(401).json({ message: "Invalid token" });
    res.send(JSON.stringify({ id: decodedId}));
  } catch (err) {
    console.error(err);
    res.status(503).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
