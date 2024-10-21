import Login from "../components/Login/Login";
import Home from "../pages/Home/Home";
import Dashboard from "../pages/Dashboard/Dashboard";
import IMAGES from "./images";
import NotFound from "../components/NotFound/NotFound";
import KnowledgeCatalog from "../components/KnowledgeCatalog/KnowledgeCatalog";
import AboutMePage from "../pages/AboutMe/AboutMe";
import AboutMe from "../components/AboutMe/AboutMe";
import ContactMePage from "../pages/ContactMe/ContactMe";
import ContactMe from "../components/ContactMe/ContactMe";
import Settings from "../components/Settings/Settings";
import Tags from "../components/Tags/Tags";
import ArticlePage from "../pages/ArticlePage/ArticlePage";

const ROUTES = [
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/article/:id",
        element: <ArticlePage />,
    },
    {
        path: "/about-me",
        element: <AboutMePage />,
    },
    {
        path: "/contact-me",
        element: <ContactMePage />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
];

export const ADMIN_ROUTES = [
    {
        path: "/dashboard/login",
        element: <Login />,
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
    },
    {
        path: "/dashboard/knowledge-catalog",
        element: <KnowledgeCatalog />,
    },
    {
        path: "/dashboard/about-me",
        element: <AboutMe />,
    },
    {
        path: "/dashboard/contact-me",
        element: <ContactMe />,
    },
    {
        path: "/dashboard/tags",
        element: <Tags />,
    },
    {
        path: "/dashboard/settings",
        element: <Settings />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
];

export const HEADER_ROUTES = [
    {
        path: "/dashboard/knowledge-catalog",
        src: IMAGES.collectionsIcon,
        label: "Wisdom encyclopedia",
    },
    {
        path: "/dashboard/about-me",
        src: IMAGES.aboutUsIcon,
        label: "About me",
    },
    {
        path: "/dashboard/contact-me",
        src: IMAGES.contactUsIcon,
        label: "Contact me",
    },
    {
        path: "/dashboard/tags",
        src: IMAGES.swapVertical,
        label: "Tags",
    },
    {
        path: "/dashboard/settings",
        src: IMAGES.settingsIcon,
        label: "Settings",
    },
];

export default ROUTES;
