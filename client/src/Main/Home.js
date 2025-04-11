import React, {useEffect, useState} from 'react'
import './Home.css'
import "../App.css";
import Game from "../Game/game/game";
import ReactDOM from "react-dom/client";
import Headers from "./Headers";

export default function Home({ reactRoot, user }) {
    const handleSubmit = () => {
        const player = user ? user : undefined;
        if (reactRoot) {
            reactRoot.render(<Game player={player} reactRoot={reactRoot} />);
        } else {
            const root = ReactDOM.createRoot(document.getElementById("subRoot"));
            root.render(<Game player={player} reactRoot={root} />);
        }
    };

    return (

        <div id="subRoot">
            <Headers />
        <div className="container" id="main">
            <div className="section-title">Entrance in 1980s</div>

            <div className="featured-post">
                <img src='/pacman_bg.png' alt="Tall buildings"/>
                <div className="featured-text">
                    <h2>In the golden age of AR<span style={{ color: '#FFD700' }}>C</span>
                        <span style={{ color: '#FFA500' }}>A</span>
                        <span style={{ color: '#FF4500' }}>D</span>
                        <span style={{ color: '#1E90FF' }}>E</span>
                        <span style={{ color: '#FF69B4' }}>S</span></h2>
                    <p>One yellow circle taught us everything — eat fast, avoid ghosts, and never stop moving.</p>

                    <button className="play-button" id="play-button" onClick={handleSubmit}>Play</button>

                </div>
            </div>
        </div>
        </div>
    );
}
