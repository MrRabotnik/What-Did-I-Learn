import React, { useEffect, useState } from "react";
import "./ContactMe.scss";
import axiosInstance from "../../utils/axios.interceptor";
import { RiseLoader } from "react-spinners";

const ContactMe = () => {
    const [pending, setPending] = useState(true);
    const [contactMe, setContactMe] = useState("");

    useEffect(() => {
        setPending(true);

        axiosInstance
            .get(`/contact-info`)
            .then((res) => {
                const data = res.data;
                if (data.success) {
                    setContactMe(data.data.description_arm);
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
        <div dangerouslySetInnerHTML={{ __html: contactMe }}></div>
    );
};

export default ContactMe;
