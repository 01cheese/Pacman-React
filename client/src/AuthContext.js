import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const getUser = async () => {
        try {
            const res = await axios.get("https://pacman-eql8.onrender.com/login/sucess", {
                withCredentials: true,
            });
            setUser(res.data.user);
        } catch (err) {
            setUser(null);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, getUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
