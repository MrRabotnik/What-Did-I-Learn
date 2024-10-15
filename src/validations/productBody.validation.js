import { toast } from "react-toastify";

const checkValidation = (body, hasSubCategories) => {
    let invalidColorsAndImages = false;
    let invalidColorsAndImagesMessage = "";

    let invalidColorsAndImagesSizes = false;
    let invalidColorsAndImagesSizesMessage = "";
    let invalidSubCategories = false;

    body.colors_and_images.forEach((colorAndImage) => {
        if (!colorAndImage.color.length) {
            invalidColorsAndImages = true;
            invalidColorsAndImagesMessage = "Գույնը բացակայում է";
        } else if (!colorAndImage.images.length) {
            invalidColorsAndImages = true;
            invalidColorsAndImagesMessage = "Նկարը բացակայում է";
        }

        colorAndImage.sizes?.forEach((item) => {
            if (colorAndImage.sizes.length > 1) {
                if (item.selected) {
                    if (!(item.price > 0)) {
                        invalidColorsAndImagesSizes = true;
                        invalidColorsAndImagesSizesMessage = "Գինը բացակայում է";
                    } else if (!(item.inStock > 0)) {
                        invalidColorsAndImagesSizes = true;
                        invalidColorsAndImagesSizesMessage = "Ապրանքի քանակը բացակայում է";
                    }
                }
            } else {
                if (!(item.price > 0)) {
                    invalidColorsAndImagesSizes = true;
                    invalidColorsAndImagesSizesMessage = "Գինը բացակայում է";
                } else if (!(item.inStock > 0)) {
                    invalidColorsAndImagesSizes = true;
                    invalidColorsAndImagesSizesMessage = "Ապրանքի քանակը բացակայում է";
                }
            }
        });
    });

    if (hasSubCategories && !body.filter_categories.subcategories.length) {
        invalidSubCategories = true;
    }

    if (!body.name_arm.length) {
        toast.error("Հայերեն անունը բացակայում է:");
        return false;
    } else if (!body.name_eng.length) {
        toast.error("Անգլերեն անունը բացակայում է:");
        return false;
    } else if (!body.description_arm.length) {
        toast.error("Հայերեն նկարագրությունը բացակայում է:");
        return false;
    } else if (!body.description_eng.length) {
        toast.error("Անգլերեն նկարագրությունը բացակայում է:");
        return false;
    } else if (!body.filter_categories.category_id?.length) {
        toast.error("Կատեգորիան բացակայում է");
        return false;
    } else if (invalidSubCategories) {
        toast.error("Ենթակատեգորիան բացակայում է");
        return false;
    } else if (!body.filter_materials.length) {
        toast.error("Նյութը բացակայում է");
        return false;
    } else if (!body.filter_styles?.length) {
        toast.error("Ոճը բացակայում է");
        return false;
    } else if (!body.filter_occasions.length) {
        toast.error("Առիթը բացակայում է");
        return false;
    } else if (invalidColorsAndImages) {
        toast.error(invalidColorsAndImagesMessage);
        return false;
    } else if (invalidColorsAndImagesSizes) {
        toast.error(invalidColorsAndImagesSizesMessage);
        return false;
    }

    const checkInfo = (info, errorMessage) => {
        const isValid = (text) => text?.length > 7 && text !== "<p><br></p>";

        if ((isValid(info.arm) || isValid(info.eng)) && !(isValid(info.arm) && isValid(info.eng))) {
            toast.error(errorMessage);
            return false;
        }

        return true;
    };

    if (
        !checkInfo(body.extra_info.extra_description, "Հավելյալ ինֆորմացիայի հայերենը կամ անգլերենը բացակայում է") ||
        !checkInfo(body.extra_info.delivery_info, "Առաքման ինֆորմացիայի հայերենը կամ անգլերենը բացակայում է") ||
        !checkInfo(body.extra_info.delivery_prices, "Առաքման գների հայերենը կամ անգլերենը բացակայում է") ||
        !checkInfo(body.extra_info.customer_support, "հաճախորդների սպասարկում հայերենը կամ անգլերենը բացակայում է") ||
        !checkInfo(body.extra_info.cancelation_policy, "Մերժելու ինֆորմացիայի հայերենը կամ անգլերենը բացակայում է")
    ) {
        return false;
    }

    return true;
};

export default checkValidation;
