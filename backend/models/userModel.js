  const mongoose = require("mongoose");

    const userSchema = new mongoose.Schema({
        id: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
            unique: true,
        },
        whiteAmount: {
            type: Number,
            required: true,
            default: 0,
        },
        enemies: {
            type: Array,
            required: true,
            default: [],
        },
        results: {
            type: Array,
            required: true,
            default: [],
        },
    });

    const User = mongoose.model("User", userSchema);

    module.exports = User;