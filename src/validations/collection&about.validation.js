import { toast } from "react-toastify";

const checkValidation = (text1, text2, img) => {
    if (!text1.length) {
        toast.error("Հայերեն տեքստը բացակայում է:");
        return false;
    }

    if (!text2.length) {
        toast.error("Անգլերեն տեքստը բացակայում է");
        return false;
    }

    if (!img && !img.length) {
        toast.error("Նկարը բացակայում է");
        return false;
    }

    return true;
};

export default checkValidation;
