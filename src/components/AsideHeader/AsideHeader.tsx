import React from "react";
import { Link, useLocation } from "react-router-dom";
import IMAGES from "../../utils/images";
import "./AsideHeader.scss";
import { HEADER_ROUTES } from "../../utils/routes";

const AsideHeader = () => {
    const { pathname } = useLocation();

    const logout = () => {
        localStorage.removeItem("access_token");
    };

    return (
        <aside className="aside-header">
            <div className="logo-container">
                <Link to={"/dashboard"}>
                    <img
                        src={IMAGES.logo}
                        alt={"Logo"}
                    />
                </Link>
            </div>
            <nav>
                {HEADER_ROUTES.map((route: any) => {
                    return (
                        <Link
                            to={route.path}
                            key={route.path}
                        >
                            <div className={`nav-item-container ${pathname === route.path ? "active" : ""}`}>
                                <div className="image-container">
                                    <img
                                        src={route.src}
                                        alt="Header nav item icon"
                                    />
                                </div>
                                <p>{route.label}</p>
                            </div>
                        </Link>
                    );
                })}
            </nav>
            <Link
                to={"/login"}
                className="log-out-container"
                onClick={logout}
            >
                <div className="image-container">
                    <img
                        src={IMAGES.logoutIcon}
                        alt="Log out"
                    />
                </div>
                <p>Log out</p>
            </Link>
        </aside>
    );
};

export default AsideHeader;
