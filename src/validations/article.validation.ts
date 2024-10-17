import { toast } from "react-toastify";

const checkValidation = (text1: string, arr: string[], text2: string) => {
    if (!text1.length) {
        toast.error("Name is empty");
        return false;
    }

    if (!arr.length) {
        toast.error("Tags is empty");
        return false;
    }

    if (text2.length < 12) {
        toast.error("Text is empty");
        return false;
    }

    return true;
};

export default checkValidation;
