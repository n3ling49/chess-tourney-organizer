const PlayerApi = require('./apis/playerApi');

let rounds = [];

function calculateRounds(players) {
  return Math.log(players.length) / Math.log(2);
}

let roundAmt;

async function initFirstRound() {
  const players = await PlayerApi.getPlayers();
  if(!players) throw Error('No players found');

  roundAmt = calculateRounds(players);

  let firstRound = [];
  let tempPlayers = [...players];
  console.log(JSON.stringify(tempPlayers));
  while (tempPlayers.length > 0) {
    const randomIndex = Math.floor(Math.random() * tempPlayers.length);
    let player1 = tempPlayers.splice(randomIndex, 1)[0];
    const randomIndex2 = Math.floor(Math.random() * tempPlayers.length);
    let player2 = tempPlayers.splice(randomIndex2, 1)[0];
    await PlayerApi.increaseWhiteAmount(player1.id);
    firstRound.push([player1.id, player2.id]);
  }
  rounds.push(firstRound);
  console.log(JSON.stringify(firstRound));
  updateEnemies(firstRound);
}

async function startNewRound() {
  let standings = await sortPlayers();
  console.log(standings)
  let newRound = [];

  while (standings.length > 0) {
    let player1 = standings.shift();
    let player2;
    for (let i = 0; i < standings.length; i++) {
      if (!player1.enemies.includes(standings[i].id)) {
        player2 = standings.splice(i, 1)[0];
        break;
      }
    }
    console.log(player1)
    console.log(player2)
    const matchup = [player1.id, player2.id];
    if(player1.whiteAmount > player2.whiteAmount) {
      matchup.reverse();
    }
    await PlayerApi.increaseWhiteAmount(matchup[0]);
    newRound.push(matchup);
  }
  rounds.push(newRound);
  console.log(JSON.stringify(newRound));
  updateEnemies(newRound);
}

function updateEnemies(round) {
  round.forEach(async (match) => {
    await PlayerApi.addEnemy(match[0], match[1]);
    await PlayerApi.addEnemy(match[1], match[0]);
  });
}

async function sortPlayers() {
  const players = await PlayerApi.getPlayers();
  let tempPlayers = new Array(...players);
  tempPlayers.sort((a, b) => {
    aValue = a.results.reduce((acc, curr) => acc + curr, 0);
    bValue = b.results.reduce((acc, curr) => acc + curr, 0);
    if (aValue === bValue) {
      aEnemyValue = a.enemies.reduce(
        (acc, curr) => acc + players[curr - 1].results.reduce((acc2, curr2) => acc2 + curr2, 0),
        0
      );
      bEnemyValue = b.enemies.reduce(
        (acc, curr) => acc + players[curr - 1].results.reduce((acc2, curr2) => acc2 + curr2, 0),
        0
      );
      if (aEnemyValue === bEnemyValue) {
        return a.id - b.id;
      }
      return aEnemyValue - bEnemyValue;
    }
    return -1 * (aValue - bValue);
  });
  return tempPlayers;
}

(async () => {
  await PlayerApi.resetDb()
.then(async () => {
  await initFirstRound()

  for (let i = 0; i < roundAmt - 1; i++) {
    let promises = [];
    rounds[i].map((match) => {
      const result = Math.floor(Math.random() * 2) / 2;

      promises.push(PlayerApi.addResult(match[0], result))
      promises.push(PlayerApi.addResult(match[1], 1 - result))

    })
    console.log(promises)
    await Promise.all(promises)
    await startNewRound();
  }

});})()
/*rounds[0].map((match) => {
  players[match[0] - 1].results.push(1);
  players[match[1] - 1].results.push(0);
});
console.log(JSON.stringify(players));
console.log(JSON.stringify(sortPlayers()));
startNewRound();
*/
module.exports = {
  rounds,
  sortPlayers,
};
