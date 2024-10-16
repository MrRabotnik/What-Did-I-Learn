import React from "react";
import "./InputRow.scss";

const InputRow = ({
    label,
    required,
    placeholder,
    value,
    setValue,
    setValueCustom,
    lang,
    type = "text",
    disabled = false,
}: any) => {
    const handleChange = (target: any) => {
        if (setValueCustom) {
            setValueCustom(target.value, lang);
        } else {
            setValue(target.value);
        }
    };
    return (
        <div className="row">
            <b>
                {label} {required ? "*" : ""}
            </b>
            <div>
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    disabled={disabled}
                    onKeyDown={(e) => {
                        if (type === "number") {
                            if (e.key === "e" || e.key === "E") {
                                e.preventDefault();
                            }
                        }
                    }}
                    onChange={(e) => {
                        handleChange(e.target);
                    }}
                />
            </div>
        </div>
    );
};

export default InputRow;
