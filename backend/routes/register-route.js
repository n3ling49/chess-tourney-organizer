const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
    try {
        let user = await User.findOne({ name: req.body.name });
        
        if (user) return res.status(400).json({ message: "User already exists" });
        
        const count = await User.count();
        const newUser = new User({
                id: count + 1,
                name: req.body.name,
            });
        
        user = await newUser.save();
        
        if(!user) throw Error('Something went wrong saving the user');
        
        const token = jwt.sign({ _id: user._id, id: user.id, name: user.name }, "12345");
        
        res.cookie("session", token);
        res.status(201).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
