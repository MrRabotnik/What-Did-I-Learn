import { toast } from "react-toastify";

const checkValidation = (textArm, textEng) => {
    if (textArm.length < 12) {
        toast.error("Հայերեն տեքստը բացակայում է:");
        return false;
    }

    if (textEng.length < 12) {
        toast.error("Անգլերեն տեքստը բացակայում է");
        return false;
    }

    return true;
};

export default checkValidation;
