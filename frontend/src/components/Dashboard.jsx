import React, { useEffect, useState } from "react";
import SwissApi from "../apis/swissApi";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.scss";
import ResultPopup from "./ResultPopup";

export default function Dashboard() {
  const [standings, setStandings] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [players, setPlayers] = useState([]);
  const [match, setMatch] = useState({});

  const [show, setShow] = useState(false);

  const [yourId, setYourId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const sessionString = document.cookie.split("; ")
      ?.find((cookie) => {
        const hasCookie = cookie.startsWith("session=")
        if (hasCookie) {
          fetch("http://localhost/api/user/me/id")
          .then((res) => res.json())
          .then((res) => {
            console.log(res)
            setYourId(res.id)
            console.log(res.id)
          });
        }
        return hasCookie;
      });
    if (!sessionString) navigate("/register");

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
    } else {
      tempMatch.enemy = players?.[nextMatch?.[0] - 1]?.name;
      tempMatch.color = "Schwarz";
    }
    console.log(tempMatch);
    setMatch(tempMatch);
  }

  return (
    <div className={`${styles.dashboard} ${show && styles.noOverflow}`}>
      <h1>Dashboard</h1>
      {[ ...rounds ]?.flat()?.length > 0 ? (
        <>
          <NextMatch match={match} rounds={rounds} />
          <button className={styles.submitResult} onClick={() => setShow(true)}>
            Ergebnis einreichen
          </button>
          <h2>Alle Partien:</h2>
          <div>
            <h3>Runde {rounds?.length}</h3>
            {rounds[rounds.length - 1]?.map((match, id) => (
              <p key={id} className={match.includes(yourId) && styles.highlightrounds}>
                ({players[match[0] - 1]?.results.reduce((acc, curr) => acc + curr, 0)}/{players[match[0] - 1]?.results.length}) {players[match[0] - 1]?.name} <strong>vs</strong> {players[match[1] - 1]?.name ?? "bye"} ({players[match[1] - 1]?.results.reduce((acc, curr) => acc + curr, 0)}/{players[match[1] - 1]?.results.length})
              </p>
            ))}
          </div>
        </>
      ) : (
        <p className={styles.preStart}>Sobald das Turnier gestartet wurde, erscheint hier Deine erste Partie :{")"}</p>
      )
      }
      <h2>Tabelle:</h2>
      <div className={styles.standings}>
      {standings.map((person, index) => (
        <Standing key={person.name+"standing"} person={{...person, spot: index}} yourId={yourId} />
      ))}
      </div>
      <ResultPopup show={show} setShow={setShow} roundsAmt={rounds.length}/>
    </div>
  );
}

function Standing({person, yourId}) {
  return (
    <div className={`${styles.standing} ${person.id === yourId && styles.highlight}`}>
      <p>{person.spot + 1 < 10 && "0"}{person.spot + 1} | {person.name}</p>
      <p>{person.results.reduce((acc, curr) => acc + curr, 0)} / {person.results.length}</p>
    </div>
  );
}

function NextMatch({ match, rounds }) {
  return (
    <div className={styles.nextMatch}>
      <h2>Nächste Partie (Rd. {rounds.length})</h2>
      <h3>vs {match.enemy}</h3>
      <p>{match.color}</p>
      <p>Brett {match.board}</p>
    </div>
  );
}
