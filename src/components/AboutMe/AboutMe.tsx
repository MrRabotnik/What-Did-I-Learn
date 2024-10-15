import React from "react";
import "./AboutMe.scss";

import IMAGES from "../../utils/images";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../utils/axios.interceptor";
import Modal from "../../components/Modal/Modal";
import { RiseLoader } from "react-spinners";
import checkValidation from "../../validations/collection&about.validation";
import { ASSETS_URI } from "../../utils/constants";

const AboutMe = () => {
    const [tabs, setTabs] = useState([
        { label: "Հայերեն", active: true },
        { label: "Անգլերեն", active: false },
    ]);
    const [activeTab, setActiveTab] = useState("hy");
    const [textArm, setTextArm] = useState("");
    const [textEng, setTextEng] = useState("");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [aboutUs, setAboutUs] = useState("");
    const [aboutUsImage, setAboutUsImage] = useState("");
    const [aboutUsImagePreview, setAboutUsImagePreview] = useState("");
    const [imageChanged, setImageChanged] = useState(false);

    const [pending, setPending] = useState(true);

    useEffect(() => {
        setPending(true);

        axiosInstance
            .get(`/about`)
            .then((res) => {
                const data = res.data;
                if (data.success) {
                    setAboutUs(data.data.description_arm);
                    setTextArm(data.data.description_arm);
                    setTextEng(data.data.description_eng);
                    setAboutUsImage(data.data.image);
                    setAboutUsImagePreview(`${ASSETS_URI}/${data.data.image}`);
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

    const handleFileChange = (target: any) => {
        const image = target.files[0];
        setAboutUsImage(image);
        setImageChanged((prev) => !prev);
        if (image) {
            const reader = new FileReader();
            reader.onload = function (e: any) {
                setAboutUsImagePreview(e.target.result);
            };
            reader.readAsDataURL(image);
        }
    };

    const handleSubmit = () => {
        const valid = checkValidation(textArm, textEng, aboutUsImage);
        if (!valid) return;

        if (imageChanged) {
            const body = new FormData();
            body.append("file", aboutUsImage);

            axiosInstance
                .post(`/file/upload`, body)
                .then((res) => {
                    const data = res.data;

                    if (!data.key.length) return;

                    const body = {
                        description_arm: textArm,
                        description_eng: textEng,
                        image: data.key,
                    };

                    axiosInstance
                        .post(`/about`, body)
                        .then((res) => {
                            const data = res.data;
                            if (data.success) {
                                toast.success("Տվյալ բաժնի տեքստը հաջողությամբ թարմացվեց:");
                                setEditModalOpen(false);
                                setAboutUs(data.data.description_arm);
                                setTextArm(data.data.description_arm);
                                setTextEng(data.data.description_eng);
                                setAboutUsImage(data.data.image);
                                setAboutUsImagePreview(`${ASSETS_URI}/${data.data.image}`);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            const body = {
                description_arm: textArm,
                description_eng: textEng,
                image: aboutUsImage,
            };

            axiosInstance
                .post(`/about`, body)
                .then((res) => {
                    const data = res.data;
                    if (data.success) {
                        toast.success("Տվյալ բաժնի տեքստը հաջողությամբ թարմացվեց:");
                        setEditModalOpen(false);
                        setAboutUs(data.data.description_arm);
                        setTextArm(data.data.description_arm);
                        setTextEng(data.data.description_eng);
                        setAboutUsImage(data.data.image);
                        setAboutUsImagePreview(`${ASSETS_URI}/${data.data.image}`);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    return (
        <section className="about-us-section">
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

                    <p>Նկար</p>
                    <div className="about-us-image-wrapper">
                        <div className="about-us-image-container">
                            <input
                                type="file"
                                id="imageUpload"
                                accept="image/png, image/jpeg"
                                onChange={(e) => handleFileChange(e.target)}
                                className={`${aboutUsImagePreview.length ? "display-none" : ""}`}
                            />
                            {aboutUsImagePreview ? (
                                <img
                                    src={aboutUsImagePreview}
                                    alt="About us"
                                />
                            ) : (
                                ""
                            )}
                            {aboutUsImagePreview && (
                                <label
                                    className="edit-icon-container"
                                    htmlFor="imageUpload"
                                >
                                    <img
                                        src={IMAGES.editIcon}
                                        alt="Edit icon"
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                </Modal>
            )}

            <div className="header">
                <span></span>
                <h2>Մեր մասին</h2>
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
            {aboutUs.length || aboutUsImage.length ? (
                <>
                    <div dangerouslySetInnerHTML={{ __html: aboutUs }}></div>
                    <div className="about-us-image-wrapper">
                        <div className="about-us-image-container">
                            <img
                                src={`${ASSETS_URI}/${aboutUsImage}`}
                                alt="About us"
                            />
                        </div>
                    </div>
                </>
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

export default AboutMe;
