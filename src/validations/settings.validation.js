import { toast } from "react-toastify";

const checkValidations = (socialLinks, regexMap) => {
    for (const [key, link] of Object.entries(socialLinks)) {
        const platform = key.split("_")[0];
        const regex = regexMap[platform];
        if (link.active && !regex.test(link.label)) {
            toast.error(`${platform.charAt(0).toUpperCase() + platform.slice(1)}-ի հղումը ոչ վավեր է`);
            return false;
        }
    }
    return true;
};

export default checkValidations;
