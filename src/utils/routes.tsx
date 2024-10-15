import Login from "../components/Login/Login";
import Home from "../pages/Home/Home";
import Dashboard from "../pages/Dashboard/Dashboard";
import IMAGES from "./images";
import NotFound from "../components/NotFound/NotFound";

const ROUTES = [
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
];

export const ADMIN_ROUTES = [
    {
        path: "/dashboard//login",
        element: <Login />,
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
    },
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
];

export const HEADER_ROUTES = [
    {
        path: "/dashboard/collections",
        src: IMAGES.collectionsIcon,
        label: "Collections",
    },
    {
        path: "/dashboard/about-us",
        src: IMAGES.aboutUsIcon,
        label: "About me",
    },
    {
        path: "/dashboard/contact-us",
        src: IMAGES.contactUsIcon,
        label: "Contact me",
    },
    {
        path: "/dashboard/settings",
        src: IMAGES.settingsIcon,
        label: "Settings",
    },
];

export default ROUTES;
