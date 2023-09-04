import React, { useEffect, useState } from "react";
import SwissApi from "../apis/swissApi";

export default function Dashboard() {
  const [standings, setStandings] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [players, setPlayers] = useState([]);
  const [match, setMatch] = useState({});

  const yourId = 1;

  useEffect(() => {
    const getStandings = async () => {
      const fetchData = await SwissApi.getStandings();
      console.log(fetchData);
      setStandings(fetchData);
    };
    getStandings();
    const getRounds = async () => {
      const fetchData = await SwissApi.getRounds();
      console.log(fetchData);
      setRounds(fetchData);
    };
    getRounds();
    const getPlayers = async () => {
      const fetchData = await SwissApi.getPlayers();
      console.log(fetchData);
      setPlayers(fetchData);
    };
    getPlayers();
  }, []);

  useEffect(() => {
    nextMatch();
  }, [players, rounds]);

  function nextMatch() {
    const tempMatch = {
      enemy: "",
      color: "",
      board: "",
    };
    const nextMatch = rounds[rounds.length - 1]?.find((match) => match.includes(yourId));
    tempMatch.board = rounds[rounds.length - 1]?.findIndex((match) => match.includes(yourId)) + 1;
    if (nextMatch?.[0] === yourId) {
      tempMatch.enemy = players?.[nextMatch?.[1] - 1]?.name;
      tempMatch.color = "Weiß";
      tempMatch.board = "1";
    } else {
      tempMatch.enemy = players?.[nextMatch?.[0] - 1]?.name;
      tempMatch.color = "Schwarz";
      tempMatch.board = "1";
    }
    console.log(tempMatch);
    setMatch(tempMatch);
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Deine nächste Partie:</h2>
      <NextMatch match={match} rounds={rounds} />
      <h2>Alle Partien:</h2>
      <div>
        <h3>Runde {rounds?.length}</h3>
        {rounds[rounds.length - 1]?.map((match, id) => (
          <h4 key={id}>
            {players[match[0] - 1]?.name} vs {players[match[1] - 1]?.name}
          </h4>
        ))}
      </div>
      <h2>Tabelle:</h2>
      {standings.map((person) => (
        <Standing key={person.name} {...person} />
      ))}
    </div>
  );
}

function Standing(person) {
  return (
    <div>
      <h3>{person.name}</h3>
      <p>
        {person.results.reduce((acc, curr) => acc + curr, 0)}/{person.results.length}
      </p>
    </div>
  );
}

function NextMatch({ match, rounds }) {
  return (
    <div>
      <h3>Runde {rounds.length}</h3>
      <h4>vs {match.enemy}</h4>
      <p>{match.color}</p>
      <p>Brett {match.board}</p>
    </div>
  );
}
