import Login from "../components/Login/Login";
import Home from "../components/Home/Home";
import Dashboard from "../components/Dashboard/Dashboard";

const ROUTES = [
    {
        route: "/login",
        element: <Login />,
    },
    {
        route: "/dashboard",
        element: <Dashboard />,
    },
    {
        route: "/",
        element: <Home />,
    },
];

export default ROUTES;
