import React from "react";
import "./Dashboard.scss";
import { asciiArt } from "../../utils/asciiArt";

const Dashboard = () => {
    return <pre className="welcome">{asciiArt}</pre>;
};

export default Dashboard;
