import React, { useState, useRef, useEffect } from "react";
import "./SelectBox.scss";
import IMAGES from "../../utils/images";

const SelectBox = ({
    dropDownArray,
    selectedCategory,
    setSelectedCategory,
    setSelectedCategoryCustom,
    type,
    callback,
}: any) => {
    const [dropDownOpen, setDropDownOpen] = useState(false);
    const ref = useRef<any>(null);

    const handleCategoryChange = (option: any, index: number) => {
        if (callback) callback();

        if (setSelectedCategoryCustom) {
            setSelectedCategoryCustom(option, type, index);
        } else {
            setSelectedCategory(option);
        }
    };

    const handleClickOutside = (event: any) => {
        event.stopPropagation();
        if (ref.current && !ref.current.contains(event.target)) {
            setDropDownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`select-box-container ${dropDownOpen ? "drop-down-open" : ""}`}
            onClick={() => {
                setDropDownOpen((prev) => !prev);
            }}
        >
            <p>{selectedCategory?.name}</p>
            <img
                src={IMAGES.arrowDownIcon}
                alt="Arrow down"
            />
            {dropDownOpen && (
                <div className="drop-down">
                    {dropDownArray && dropDownArray.length
                        ? dropDownArray.map((option: any, index: number) => {
                              return (
                                  <div
                                      className="option"
                                      key={index}
                                      onClick={(e) => {
                                          if (type) {
                                              e.stopPropagation();
                                          }
                                          handleCategoryChange(option, index);
                                      }}
                                  >
                                      {type === "size" ? <p> {option.value}</p> : <p> {option.name}</p>}
                                      {option.selected && setSelectedCategoryCustom ? (
                                          <div className="image-container">
                                              <img
                                                  src={IMAGES.checkmarkWhiteIcon}
                                                  alt="Checkmark"
                                              />
                                          </div>
                                      ) : setSelectedCategoryCustom ? (
                                          <div className="checkbox"></div>
                                      ) : (
                                          ""
                                      )}
                                  </div>
                              );
                          })
                        : ""}
                </div>
            )}
        </div>
    );
};

export default SelectBox;
