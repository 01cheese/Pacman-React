import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Error.css';
import Headers from "./Headers";

const Error = () => {
    return (
        <>
            <Headers />
            <div className="error-page">
                <h1 className="error-404">404</h1>
            </div>
        </>
    );
};

export default Error;
