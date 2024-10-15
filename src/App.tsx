import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ROUTES from "./utils/routes";

interface RouteElement {
    route: string;
    element: React.ReactNode;
}

function App() {
    return (
        <div>
            <Router>
                <Routes>
                    {ROUTES.map((route: RouteElement, index: number) => {
                        return (
                            <Route
                                key={index}
                                path={route.route}
                                element={route.element}
                            />
                        );
                    })}
                </Routes>
            </Router>
        </div>
    );
}

export default App;
