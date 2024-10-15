import { toast } from "react-toastify";

const checkValidation = (text1, text2) => {
    if (!text1.length) {
        toast.error("Հայերեն կատեգորիան բացակայում է");
        return false;
    }

    if (!text2.length) {
        toast.error("Անգլերեն կատեգորիան բացակայում է");
        return false;
    }

    return true;
};

export default checkValidation;
