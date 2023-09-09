async function getStandings() {
  const response = await fetch("http://116.203.53.136:5000/standings");
  const data = await response.json();
  console.log(data);
  return await data;
}

async function getRounds() {
  const response = await fetch("http://116.203.53.136:5000/rounds");
  const data = await response.json();
  console.log(data);
  return await data;
}

async function getPlayers() {
  const response = await fetch("http://116.203.53.136:5000/players");
  const data = await response.json();
  console.log(data);
  return await data;
}

module.exports = {
  getStandings,
  getRounds,
  getPlayers,
};
