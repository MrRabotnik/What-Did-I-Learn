import React, { useEffect, useState } from "react";
import "./AboutMe.scss";
import axiosInstance from "../../utils/axios.interceptor";
import { RiseLoader } from "react-spinners";

const AboutMe = () => {
    const [pending, setPending] = useState(true);
    const [aboutMe, setAboutMe] = useState("");

    useEffect(() => {
        setPending(true);

        axiosInstance
            .get(`/about`)
            .then((res) => {
                const data = res.data;
                if (data.success) {
                    setAboutMe(data.data.description_arm);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setPending(false);
            });
    }, []);
    return pending ? (
        <div className="loader-container">
            <RiseLoader
                color="#d8d8d8"
                size={10}
            />
        </div>
    ) : (
        <div dangerouslySetInnerHTML={{ __html: aboutMe }}></div>
    );
};

export default AboutMe;
