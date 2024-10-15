import { toast } from "react-toastify";

const checkValidation = (text1, text2, text3, text4) => {
    if (!text1?.length) {
        toast.error("Հայերեն հարցը բացակայում է");
        return false;
    }

    if (!text2?.length) {
        toast.error("Անգլերեն հարցը բացակայում է");
        return false;
    }

    if (text3?.length < 8) {
        toast.error("Հայերեն պատասխանը բացակայում է");
        return false;
    }

    if (text4?.length < 8) {
        toast.error("Անգլերեն պատասխանը բացակայում է");
        return false;
    }

    return true;
};

export default checkValidation;
