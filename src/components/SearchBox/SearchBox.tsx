import React, { useRef } from "react";
import IMAGES from "../../utils/images";
import "./SearchBox.scss";
import SearchDebounce from "../../utils/searchDebounce";

const SearchBox = ({ placeholder, value, setValue, setSubmitedSearchTerm, setPending }: any) => {
    const debouncedSearch = useRef(SearchDebounce(setSubmitedSearchTerm, 1000)).current;

    return (
        <div className="input-container">
            <div className="search-icon-container">
                <img
                    src={IMAGES.searchIcon}
                    alt="Search"
                    onClick={() => setSubmitedSearchTerm(value)}
                />
            </div>
            <input
                className="input"
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => {
                    setPending(true);
                    setValue(e.target.value);
                    debouncedSearch(e.target.value);
                }}
            />
        </div>
    );
};

export default SearchBox;
