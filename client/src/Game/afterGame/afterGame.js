import "./leaderboard.css";
import Game from "../game/game";
import React from "react";


export default function AfterGame({ variables }) {

  const resetVariables = () => {
    variables.score = 0;
    variables.start = true;
  };

  const handlePlayAgain = async () => {
    try {
      // user
      const res = await fetch("https://pacman-eql8.onrender.com/login/sucess", {
        method: "GET",
        credentials: "include"
      });

      if (res.status === 200) {
        const data = await res.json();

        // save result
        await fetch("https://pacman-eql8.onrender.com/save-score", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            score: variables.score,
            userId: data.user._id
          }),
        });

        // reset and new game
        resetVariables();
        variables.reactRoot.render(
            <Game player={variables.player} reactRoot={variables.reactRoot} />
        );
      } else {
        window.location.href = "https://pacman.vzbb.site/login";
      }
    } catch (err) {
      console.error("Error saving score or loading user:", err);
    }
  };


  const handleChangePlayer = async () => {
    try {
      // user
      const res = await fetch("https://pacman-eql8.onrender.com/login/sucess", {
        method: "GET",
        credentials: "include"
      });

      if (res.status === 200) {
        const data = await res.json();
        console.log("Logged in as:", data.user);

        // save score
        const saveRes = await fetch("https://pacman-eql8.onrender.com/save-score", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            score: variables.score,
            userId: data.user._id
          }),
        });

        const updated = await saveRes.json();
        const updatedUser = updated.user;
        console.log("Updated user:", updatedUser);
        console.log(updated);
        console.log(saveRes);


        resetVariables();

        localStorage.setItem("refreshDashboard", "true");
        window.location.href = "https://pacman.vzbb.site/dashboard"

      } else {
        window.location.href = "https://pacman.vzbb.site/login";
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    }
  };


  return (
      <div className="leaderboard">
        <h1>Game Over</h1>
        <h3>You scored {variables.score} points</h3>
        <div className="buttons">
          <button className="play-again" onClick={handlePlayAgain}>
            Play Again
          </button>
          <button className="home" onClick={handleChangePlayer}>
            Home
          </button>
        </div>
      </div>
  );
}
