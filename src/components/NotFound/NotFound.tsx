import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.scss";

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate("/");
    };

    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1>404</h1>
                <h2>Oops! Page Not Found</h2>
                <p>We can't seem to find the page you're looking for.</p>
                <button onClick={goHome}>Go Back Home</button>
            </div>
        </div>
    );
};

export default NotFound;
