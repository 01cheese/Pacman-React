import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import Headers from './Headers';
import Game from '../Game/game/game';
import ReactDOM from 'react-dom/client';
import Themes from './Themes';
import './Themes.css';
import './buttons.css';

const Dashboard = ({ reactRoot }) => {
    const [editMode, setEditMode] = useState(false);
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [tempUsername, setTempUsername] = useState('');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'default');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const getUser = async () => {
        try {
            const { data } = await axios.get('https://pacman-eql8.onrender.com/user/info', { withCredentials: true });
            setUser(data.user);
            console.log("[Dashboard] Fresh Data from DB:", data.user.maxScore, data.user.totalScore);
        } catch (error) {
            console.error("Error fetching fresh user:", error);
            // window.location.href = '/login';
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if (editMode && user) {
            setTempUsername(user.username);
        }
    }, [editMode, user]);

    const changeTheme = (themeName) => {
        setTheme(themeName);
        localStorage.setItem('theme', themeName);
    };

    const handleSubmit = () => {
        if (reactRoot) {
            reactRoot.render(<Game player={user} reactRoot={reactRoot} />);
        } else {
            const root = ReactDOM.createRoot(document.getElementById('subRoot'));
            root.render(<Game player={user} reactRoot={root} />);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await axios.delete(`https://pacman-eql8.onrender.com/user/delete/${user._id}`);

            localStorage.clear();
            sessionStorage.clear();
            caches.keys().then((names) => {
                for (let name of names) caches.delete(name);
            });
            window.location.href = 'https://pacman-eql8.onrender.com/logout'   // ?????????????
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting account");
        }
    };

    const handleSave = async () => {
        try {
            const response = await axios.put('https://pacman-eql8.onrender.com/update-username', {
                userId: user._id,
                newUsername: tempUsername
            });
            setEditMode(false);
            setUser(response.data.user);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Помилка оновлення імені');
        }
    };

    if (!user) {
        return (
            <div id="subRoot">
                <Headers />
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div id="subRoot">
            <Headers />
            <div className={`profile-container ${Themes[theme].className}`}>
                <div className="card light">
                    <div className="banner light-banner" onClick={() => setEditMode(!editMode)}>
                        <span className="banner-text">{editMode ? 'Back' : 'Click'}</span>
                        <span className="banner-text">{editMode ? 'Profile' : 'Setting'}</span>
                    </div>

                    {!editMode ? (
                        <>
                            <span className="card__title">User {user.username}</span>
                            <p className="card__subtitle">Track your progress 👀😆👾</p>
                            <div className="user-info">
                                <span className="card__label">Score</span>
                                <div className="score-block">
                                    <span className="score-number">Max Score: {user.maxScore || 0}</span>
                                    <span className="score-number">Total Score: {user.totalScore || 0}</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress" style={{ width: '100%' }}></div>
                                </div>
                                <button className="play-button" id="play-button" onClick={handleSubmit}>
                                    Play
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <span className="card__title">Settings</span>
                            <div className="card__form">
                                <div className="buttons-wrapper">
                                    {['default', 'dark', 'funky'].map((themeName) => (
                                        <div className="button" key={themeName}>
                                            <button onClick={() => changeTheme(themeName)} type="button"></button>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    ))}
                                </div>
                                <div className="progress-bar">
                                    <div className="progress" style={{ width: '100%' }}></div>
                                </div>
                                <span className="card__title">UserName</span>
                                <input
                                    type="text"
                                    name="username"
                                    value={tempUsername}
                                    onChange={(e) => setTempUsername(e.target.value)}
                                    placeholder="Your username"
                                />
                                {errorMessage && <p className="errorMessage" style={{color: 'red', fontWeight: 'bold', fontSize:'20px'}}>{errorMessage}</p>}
                                <div className="progress-bar">
                                    <div className="progress" style={{ width: '100%' }}></div>
                                </div>
                                <button className="save-button" onClick={() => setShowDeleteConfirm(true)}>
                                    Delete Account
                                </button>
                                {showDeleteConfirm && (
                                    <div className="popup-overlay">
                                        <div className="popup">
                                            <p>Are you sure you want to delete your account?</p>
                                            <button onClick={handleDeleteAccount}>Yes, delete</button>
                                            <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                                        </div>
                                    </div>
                                )}
                                <button className="save-button" onClick={handleSave}>
                                    Save
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
