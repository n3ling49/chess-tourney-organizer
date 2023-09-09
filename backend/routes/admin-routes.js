const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const authenticateAdmin = require("../middlewares/authenticate-token");
const PlayerApi = require('../apis/playerApi');
const { startNewRound, initFirstRound } = require("../swiss");

router.post("/login", async (req, res) => {
    try{
        const password = req.body.password;
        if(!password) throw Error('No password provided');
        if(password !== "54321") throw Error('Wrong password');
        const adminSession = jwt.sign({ rnd: Math.random()}, '12345');
        if(!adminSession) throw Error('Couldn\'t sign admin session');
        res.cookie("adminSession", adminSession, {maxAge: new Date(Date.now() + 60 * 60 * 24 * 7)});
        res.status(200).json({ message: "Logged in" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/cleardb", authenticateAdmin, async (req, res) => {
    try{
        await User.deleteMany({});
        res.status(200).json({ message: "Database reset" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/resetdb", authenticateAdmin, async (req, res) => {
    try{
        await PlayerApi.resetDb();
        res.status(200).json({ message: "Database reset" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/starttournament", authenticateAdmin, async (req, res) => {
    try{
        await initFirstRound();
        res.status(200).json({ message: "Tournament started" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/newround", authenticateAdmin, async (req, res) => {
    try{
        await startNewRound();
        res.status(200).json({ message: "New round started" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("addresult", authenticateAdmin, async (req, res) => {
    try{
        const result = req.body.result;
        const round = req.body.round;
        const token = req.cookies.session;
        if(!result || !round || !token) return res.status(400).json({ message: "Result, Round or token missing" });
        const decodedId = jwt.decode(token, {complete: true})?.payload?.id;
        if(!decodedId) return res.status(401).json({ message: "Invalid token" });

        const updatedPlayer = await PlayerApi.addResult(decodedId, result, round - 1);
        if(!updatedPlayer) throw Error('Couldn\'t update player');
        res.status(200).json({ message: "Result added" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;