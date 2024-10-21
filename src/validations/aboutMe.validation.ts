import { toast } from "react-toastify";

const checkValidation = (text1: string, text2: string) => {
    if (!text1.length) {
        toast.error("Հայերեն տեքստը բացակայում է:");
        return false;
    }

    if (!text2.length) {
        toast.error("Անգլերեն տեքստը բացակայում է");
        return false;
    }

    return true;
};

export default checkValidation;
