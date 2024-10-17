import React, { useEffect, useState } from "react";
import "./ContactMe.scss";
import IMAGES from "../../utils/images";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../utils/axios.interceptor";
import Modal from "../../components/Modal/Modal";
import { RiseLoader } from "react-spinners";
import checkValidation from "../../validations/contactMe.validation";

const ContactMe = () => {
    const [tabs, setTabs] = useState([
        { label: "Հայերեն", active: true },
        { label: "Անգլերեն", active: false },
    ]);
    const [activeTab, setActiveTab] = useState("hy");
    const [textArm, setTextArm] = useState("");
    const [textEng, setTextEng] = useState("");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [ContactUs, setContactUs] = useState("");

    const [pending, setPending] = useState(true);

    useEffect(() => {
        setPending(true);

        axiosInstance
            .get(`/contact-us-info`)
            .then((res) => {
                const data = res.data;
                if (data.success) {
                    setContactUs(data.data.description_arm);
                    setTextArm(data.data.description_arm);
                    setTextEng(data.data.description_eng);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setPending(false);
            });
    }, []);

    const changeActiveTab = (text: string) => {
        const arr = tabs.map((tab) => {
            if (tab.label === text) {
                tab.active = true;
                setActiveTab(tab.label === "Հայերեն" ? "hy" : "en");
            } else {
                tab.active = false;
            }
            return tab;
        });

        setTabs(arr);
    };

    const handleSubmit = () => {
        const valid = checkValidation(textArm, textEng);

        if (!valid) return;

        const body = {
            description_arm: textArm,
            description_eng: textEng,
            image: "",
        };

        axiosInstance
            .post(`/contact-us-info`, body)
            .then((res) => {
                const data = res.data;
                if (data.success) {
                    toast.success("Տվյալ բաժնի տեքստը հաջողությամբ թարմացվեց:");
                    setEditModalOpen(false);
                    setContactUs(data.data.description_arm);
                    setTextArm(data.data.description_arm);
                    setTextEng(data.data.description_eng);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <section className="contact-us-section">
            {editModalOpen && (
                <Modal
                    title={"Խմբագրել"}
                    closeModal={setEditModalOpen}
                    submitModal={handleSubmit}
                >
                    <p>Նկարագրություն</p>
                    <div className="tabs-container">
                        {tabs.map((tab, index) => {
                            return (
                                <div
                                    key={index}
                                    onClick={() => changeActiveTab(tab.label)}
                                    className={`tab ${tab.active ? "active" : ""}`}
                                >
                                    {tab.label}
                                </div>
                            );
                        })}
                    </div>
                    <ReactQuill
                        className={activeTab === "hy" ? "" : "display-none"}
                        value={textArm}
                        onChange={setTextArm}
                        placeholder="Description"
                        modules={{
                            toolbar: {
                                container: [
                                    ["bold", "italic", "underline", "strike", "blockquote"],
                                    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                                ],
                            },
                        }}
                    />

                    <ReactQuill
                        className={activeTab === "en" ? "" : "display-none"}
                        value={textEng}
                        onChange={setTextEng}
                        placeholder="Description"
                        modules={{
                            toolbar: {
                                container: [
                                    ["bold", "italic", "underline", "strike", "blockquote"],
                                    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                                ],
                            },
                        }}
                    />
                </Modal>
            )}
            <div className="header">
                <span></span>
                <h2>Կապ մեզ հետ</h2>
                {!textArm.length && !textEng.length && !pending ? (
                    <div className="add-new-category-container">
                        <button
                            onClick={() => setEditModalOpen(true)}
                            className="button"
                        >
                            + Ավելացնել նոր տեքստ
                        </button>
                    </div>
                ) : (
                    <div className="image-container">
                        <img
                            src={IMAGES.editIcon}
                            alt="Edit icon"
                            onClick={() => setEditModalOpen(true)}
                        />
                    </div>
                )}
            </div>
            {ContactUs.length ? (
                <div dangerouslySetInnerHTML={{ __html: ContactUs }}></div>
            ) : pending ? (
                <div className="loader-container">
                    <RiseLoader
                        color="#d8d8d8"
                        size={10}
                    />
                </div>
            ) : (
                <p className="text-align-center">Ոչինչ չի գտնվել</p>
            )}
        </section>
    );
};

export default ContactMe;
