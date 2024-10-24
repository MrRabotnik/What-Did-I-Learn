import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.scss";

import IMAGES from "../../utils/images";
import axiosInstance from "../../utils/axios.interceptor";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [emailValid, setEmailValid] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordValid, setPasswordValid] = useState(false);
    const [validation, setValidation] = useState(false);
    const [loginClicked, setLoginClicked] = useState(false);
    const [eyeClicked, setEyeClicked] = useState(false);
    const [passwordType, setPasswordType] = useState("password");

    useEffect(() => {
        const regex =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (regex.test(email)) {
            setEmailValid(true);
        } else {
            setEmailValid(false);
        }

        if (Number(password.length) > 6) {
            setPasswordValid(true);
        } else {
            setPasswordValid(false);
        }

        if (emailValid && passwordValid) {
            setValidation(true);
        } else {
            setValidation(false);
        }
    }, [email, emailValid, password, passwordValid, validation]);

    const toggleEye = (val: string) => {
        setEyeClicked(!eyeClicked);
        setPasswordType(val);
    };

    const handleSubmit = async (e: any) => {
        if (!validation) return;
        e.preventDefault();
        setLoginClicked(true);
        try {
            const body = {
                email,
                password,
            };
            axiosInstance
                .post(`/auth/login`, body)
                .then((res) => {
                    const data = res.data;

                    if (data.success) {
                        toast.success("Successfully logged in");

                        localStorage.setItem("access_token", data.data.access_token);

                        navigate("/dashboard");
                    } else {
                        toast(data.message, {
                            type: "error",
                        });
                    }
                })
                .catch((error) => {
                    toast(error.message, {
                        type: "error",
                    });
                });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className="login-section">
            <div className="container">
                <div className="modal">
                    <form
                        onSubmit={handleSubmit}
                        className="form"
                        name="login"
                    >
                        <p>Էլ. հասցե</p>
                        <input
                            className={(emailValid ? "" : "input-error ") + "input"}
                            type="email"
                            name="email"
                            id="email"
                            autoComplete="email"
                            placeholder="Էլ. հասցե"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {!emailValid && loginClicked && <p className="error">Invalid email</p>}

                        <p>Գաղտնաբառ</p>
                        <div className="password-container">
                            <input
                                className={(passwordValid ? "" : "input-error ") + "input"}
                                type={passwordType}
                                name="password"
                                id="password"
                                placeholder="Գաղտնաբառ"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {eyeClicked ? (
                                <img
                                    src={IMAGES.eyeClosed}
                                    alt="Closed Eye"
                                    onClick={() => toggleEye("password")}
                                />
                            ) : (
                                <img
                                    src={IMAGES.eye}
                                    alt="Eye"
                                    onClick={() => toggleEye("text")}
                                />
                            )}
                        </div>
                        {!passwordValid && loginClicked && <p className="error">Invalid password</p>}

                        {validation ? (
                            <button
                                type="submit"
                                className={"custom-button"}
                            >
                                Մուտք
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className={"custom-button disabled"}
                            >
                                Մուտք
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
}
