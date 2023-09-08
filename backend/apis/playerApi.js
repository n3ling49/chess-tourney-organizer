const User = require("../models/userModel");

async function increaseWhiteAmount(playerId) {
    try{
        const newDoc = await User.findOneAndUpdate({ id: playerId }, { $inc: { whiteAmount: 1 } }, { new: true });
        console.log(playerId)
        if(!newDoc) throw Error("Couldn't update white amount");
    } catch (err) {
        console.error(err);
    }
}

async function getPlayers() {
    const players = await User.find();
    if(!players) throw Error('No players found');
    return players;
}

async function getPlayerById(playerId) {
    try {
        const player = await User.findOne({ id: playerId });
        if(!player) throw Error("Couldn't find player");
        return player;
    } catch (err) {
        console.error(err);
    }
}

async function addEnemy(playerId, enemyId) {
    try {
        const newDoc = await User.findOneAndUpdate({ id: playerId }, { $push: { enemies: enemyId } }, { new: true });
        if(!newDoc) throw Error("Couldn't add enemy");
    } catch (err) {
        console.error(err);
    }
}

async function resetDb() {
    try {
        await User.updateMany({}, { $set: { whiteAmount: 0, enemies: [], results: [] } }, { new: true });
    } catch (err) {
        console.error(err);
    }
}

async function addResult(playerId, result, round = null) {
    try {
        let newDoc;
        if(!round) {
            newDoc = await User.findOneAndUpdate({ id: playerId }, { $push: { results: result } }, { new: true });
        } else {
            newDoc = await User.findOneAndUpdate({ id: playerId }, { $set: { [`results.${round}`]: result } }, { new: true });
        }
        if(!newDoc) throw Error("Couldn't add result");
        return newDoc;
    } catch (err) {
        console.error(err);
    }
}

async function updateLastColor(playerId, color) {
    try {
        const newDoc = await User.findOneAndUpdate({ id: playerId }, { $set: { lastColor: color } }, { new: true });
        if(!newDoc) throw Error("Couldn't update last color");
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    increaseWhiteAmount,
    getPlayers,
    addEnemy,
    resetDb,
    addResult,
    updateLastColor,
    getPlayerById,
};