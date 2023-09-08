import React from 'react'
import styles from './ResultPopup.module.scss'

export default function ResultPopup({show, setShow, roundsAmt}) {
  return (
    <div className={`${styles.popup} ${!show && styles.hide}`}>
        <p className={styles.back} onClick={() => setShow(false)}>x</p>
        <FlipCard type={"win"} text={"Sieg"} setShow={setShow} roundsAmt={roundsAmt} />
        <FlipCard type={"draw"} text={"Remis"} setShow={setShow} roundsAmt={roundsAmt} />
        <FlipCard type={"lose"} text={"Niederlage"} setShow={setShow} roundsAmt={roundsAmt} />
    </div>
  )
}

function FlipCard({type, text, setShow, roundsAmt}){

  function handleSubmit(result){
    console.log(result);
    let resultPoints;
    switch(result){
      case "win":
        resultPoints = 1;
        break;
      case "draw":
        resultPoints = 0.5;
        break;
      case "lose":
        resultPoints = 0;
        break;
      default:
        resultPoints = 0;
    }
    fetch("http://localhost/api/user/me/result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        result: resultPoints,
        round: roundsAmt,
      }),
    }).then((res) => {
      console.log(res);
      if (res.ok) setShow(false);
    });
  }

  return (
    <div className={styles.flipCard}>
      <div className={styles.flipCardInner}>
        <div className={styles.flipCardFront}>
          <button className={styles[type]}>{text}</button>
        </div>
        <div className={styles.flipCardBack}>
          <button className={styles[type]} onClick={() => handleSubmit(type)}>{text} bestätigen</button>
        </div>
      </div>
    </div>
  )
}
