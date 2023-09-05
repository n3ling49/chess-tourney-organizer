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

async function addEnemy(playerId, enemyId) {
    try {
        const newDoc = await User.findOneAndUpdate({ id: playerId }, { $push: { enemies: enemyId } }, { new: true });
        if(!newDoc) throw Error("Couldn't add enemy");
    } catch (err) {
        console.error(err);
    }
}

async function resetDb() {
    await User.updateMany({}, { $set: { whiteAmount: 0, enemies: [], results: [] } }, { new: true });
}

async function addResult(playerId, result) {
    try {
        const newDoc = await User.findOneAndUpdate({ id: playerId }, { $push: { results: result } }, { new: true });
        if(!newDoc) throw Error("Couldn't add result");
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
};