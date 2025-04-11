import './App.css';
import './index.css';
import Home from './Main/Home';
import Login from './Main/Login';
import Dashboard from './Main/Dashboard';
import Error from './Main/Error';
import Leaderboard from './Leaderboard/leaderboard';
import Store from './Store/Store';
import AfterGame from './Game/afterGame/afterGame';
import 'primereact/resources/themes/lara-dark-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import "./App.css";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Game from "./Game/game/game";

function App() {
    return (
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/store" element={<Store/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/aftergame" element={<AfterGame/>}/>
                    <Route path="/qqq" element={<Error/>}/>
                    <Route path="/leaderboard" element={<Leaderboard/>}/>
                    <Route path="/game" element={<Game />} />
                </Routes>
    );
}

export default App;
