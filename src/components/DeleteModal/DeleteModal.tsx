import React from "react";
import "./DeleteModal.scss";
import IMAGES from "../../utils/images";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axios.interceptor";

const DeleteModal = ({
    title,
    url,
    setDeleteModalOpen,
    setUpdate,
    deletingItem,
    toastMessage,
    customCallback,
}: any) => {
    const handleDelete = () => {
        axiosInstance
            .delete(url)
            .then((res) => {
                const data = res.data;
                if (data.success) {
                    toast.success(toastMessage);
                    setUpdate((prev: boolean) => !prev);
                    if (customCallback) {
                        customCallback();
                    }
                } else {
                    toast.error(data.message);
                }
                setDeleteModalOpen(false);
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    return (
        <div
            className="delete-modal-wrapper"
            onClick={() => {
                setDeleteModalOpen(false);
            }}
        >
            <div
                className="delete-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="close-modal">
                    <img
                        src={IMAGES.closeIcon}
                        alt="Close icon"
                        onClick={() => {
                            setDeleteModalOpen(false);
                        }}
                    />
                </p>
                {/* <h2>Ջնջել?</h2> */}
                <p>
                    Վստա՞հ եք որ ցանկանում եք ջնջել <b>"{title}"</b> {deletingItem}։
                </p>
                <div className="button-container">
                    <button
                        className="custom-button"
                        onClick={handleDelete}
                    >
                        Ջնջել
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
