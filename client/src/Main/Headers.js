import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import './headers.css';

const Headers = () => {
    const [userdata, setUserdata] = useState({});
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const getUser = async () => {
        try {
            const response = await axios.get("https://pacman-eql8.onrender.com/login/sucess", { withCredentials: true });
            setUserdata(response.data.user);
        } catch (error) {
            console.log("error", error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <header className="header">
            <nav className="navbar">
                <h1 className="logo"><a>VZ.</a>PacMan</h1>

                <button
                    className="burger"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    ☰
                </button>

                <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/leaderboard">Leaderboard</Link></li>
    <li><Link to="/store">Store</Link></li>
                            <li><Link to="/dashboard">Profile</Link></li>
                            <li><Link to='https://pacman-eql8.onrender.com/logout'>Logout</Link></li>


                    {Object.keys(userdata).length > 0 ? (
                        <>
                            <li><Link to="/store">Store</Link></li>
                            <li><Link to="/dashboard">Profile</Link></li>
                            <li><Link to='https://pacman-eql8.onrender.com/logout'>Logout</Link></li>
                        </>
                    ) : (
                        <li><Link to="/login">Login</Link></li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Headers;
