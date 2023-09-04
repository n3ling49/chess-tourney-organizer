let players = [
  {
    id: 1,
    name: "Noah",
    whiteAmount: 0,
    enemies: [],
    results: [],
  },
  {
    id: 2,
    name: "Tim",
    whiteAmount: 0,
    enemies: [],
    results: [],
  },
  {
    id: 3,
    name: "Kyra",
    whiteAmount: 0,
    enemies: [],
    results: [],
  },
  {
    id: 4,
    name: "Angelo",
    whiteAmount: 0,
    enemies: [],
    results: [],
  },
];

let rounds = [];

function calculateRounds(players) {
  return Math.log(players.length) / Math.log(2);
}

const roundAmt = calculateRounds(players);

function initFirstRound() {
  let firstRound = [];
  let tempPlayers = [...players];
  console.log(JSON.stringify(tempPlayers));
  while (tempPlayers.length > 0) {
    const randomIndex = Math.floor(Math.random() * tempPlayers.length);
    let player1 = tempPlayers.splice(randomIndex, 1)[0];
    const randomIndex2 = Math.floor(Math.random() * tempPlayers.length);
    let player2 = tempPlayers.splice(randomIndex2, 1)[0];
    players[player1.id - 1].whiteAmount++;
    firstRound.push([player1.id, player2.id]);
  }
  rounds.push(firstRound);
  console.log(JSON.stringify(firstRound));
  updateEnemies(firstRound);
}

function startNewRound() {
  let standings = sortPlayers();
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

    const matchup = [player1.id, player2.id];
    if(player1.whiteAmount > player2.whiteAmount) {
      matchup.reverse();
    }
    players[matchup[0] - 1].whiteAmount++;
    newRound.push(matchup);
  }
  rounds.push(newRound);
  console.log(JSON.stringify(newRound));
  updateEnemies(newRound);
}

function updateEnemies(round) {
  round.forEach((match) => {
    players[match[0] - 1].enemies.push(match[1]);
    players[match[1] - 1].enemies.push(match[0]);
  });
  console.log(JSON.stringify(players));
}

function sortPlayers() {
  let tempPlayers = [...players];
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

initFirstRound();
rounds[0].map((match) => {
  players[match[0] - 1].results.push(1);
  players[match[1] - 1].results.push(0);
});
console.log(JSON.stringify(players));
console.log(JSON.stringify(sortPlayers()));
startNewRound();

module.exports = {
  players,
  rounds,
  sortPlayers,
};
