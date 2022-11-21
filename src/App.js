import React from "react";
import Die from "./Die";
import Confetti from "./Confetti";

export default function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [btnName, setBtnName] = React.useState("Roll");
  const [rollCount, setRollCount] = React.useState(0);
  const [seconds, setSeconds] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [bestTime, setBestTime] = React.useState(JSON.parse(localStorage.getItem("Best-time")) || false);
  const [newTime, setNewTime] = React.useState(false);
  const [existingTime, setExistingTime] = React.useState(false);
  const [previousTime, setPreviousTime] = React.useState(false);

  React.useEffect(() => {
    let counter = setInterval(() => {
          if(btnName === "Roll"){
            setSeconds(seconds+1)
            if (seconds === 59){
             setSeconds(0)
             setMinutes(prev => prev +1)
            }
          } else {
            setSeconds(seconds)
            setMinutes(minutes)
          }
        }, 1000)
    return () => clearInterval(counter);
  }, [seconds])
  
  React.useEffect(() => {
    let mapResult = dice.filter(dic => dic.isHeld === true && dic.value === dice[0].value)
    if(mapResult.length === 10){
      setBtnName("New Game")
      if(!bestTime){
        window.localStorage.setItem("Best-time", JSON.stringify([minutes,seconds]))
        setBestTime(JSON.parse(window.localStorage.getItem("Best-time")))
        setNewTime(true)
      } else if(bestTime[0] > minutes || bestTime[1] > seconds) {
        window.localStorage.setItem("Best-time", JSON.stringify([minutes,seconds]))
        setBestTime(JSON.parse(localStorage.getItem("Best-time")));
        setExistingTime(true)
      } else {
        setPreviousTime(true)
      }
    } else {
      setBtnName("Roll")
    }
  }, [dice]); 

  function refreshPage() {
    window.location.reload(false);
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push({
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: i,
      });
    }
    return newDice;
  }

  function holdDice(idex) {
    let newDice = dice.map((die) =>
      die.id === idex
        ? {
            ...die,
            isHeld: !die.isHeld,
          }
        : die
    );
    setDice(newDice);
  }

  function rollDice() {
    let newDice = dice.map((dice) =>
      dice.isHeld
        ? {
            ...dice,
            isHeld: true,
          }
        : {
            ...dice,
            value: Math.ceil(Math.random() * 6),
          }
    );
    setDice(newDice);
    setRollCount(prev => prev+1)
  }

  const diceElements = dice.map((die, index) => (
    <Die
      value={die.value}
      isHeld={die.isHeld}
      key={index}
      id={die.id}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {btnName === "New Game" && <Confetti></Confetti>}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={btnName === "Roll" ? rollDice : refreshPage}>
        {btnName}
      </button>
      <p className="roll-count">Number of Rolls <span>{rollCount}</span></p>
      {<p className="time-counter">{minutes<=9? "0"+minutes:minutes}:{seconds <= 9 ? "0"+seconds: seconds}</p>}
      {newTime? <p className="best-time">your best time now {bestTime[0]} min {bestTime[1]} sec</p>:""}
      {existingTime? <p className="best-time">your new time is {bestTime[0]} min {bestTime[1]} sec</p>:""}
      {previousTime? <p className="best-time">Best score still {bestTime[0]} min {bestTime[1]} sec</p>:""}
    </main>
  );
}
