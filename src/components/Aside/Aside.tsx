import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../utils/axios.interceptor";
import "./Aside.scss";
import SearchDebounce from "../../utils/searchDebounce";
import { useNavigate, useLocation } from "react-router-dom";

interface Tag {
    name: string;
    _id: string;
}

const Aside = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get("category_id");

    const [tags, setTags] = useState<Tag[]>([]);
    const [pending, setPending] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axiosInstance
            .get("/tags")
            .then((response) => {
                if (response.data.success) {
                    setTags([{ name: "All" }, ...response.data.data.docs]);
                }
            })
            .catch((error) => {
                console.error("Error fetching tags:", error);
            })
            .finally(() => {
                setPending(false);
            });
    }, []);

    const search = () => {
        axiosInstance
            .get(`/tags?search_term=${searchTerm}`)
            .then((res) => {
                if (res.data.success) {
                    setTags(res.data.data.docs);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    const pushQuery = (id: string) => {
        if (id) navigate(`?category_id=${id}`);
        else navigate(`/`);
    };

    const debouncedSearch = useRef(SearchDebounce(search, 1000)).current;

    return (
        <aside className="aside">
            <h2 className="aside-title">Wisdom Encyclopedia</h2>
            <input
                type="text"
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => {
                    debouncedSearch(e.target.value);
                    setSearchTerm(e.target.value);
                }}
                className="search-input"
            />
            <ul className="tags-list">
                {pending ? (
                    <p>Loading...</p>
                ) : tags.length > 0 ? (
                    tags.map((tag: Tag) => (
                        <li
                            key={tag._id}
                            className={`tag-item ${tag._id === categoryId ? "selected" : ""}`}
                            onClick={() => pushQuery(tag._id)}
                        >
                            {tag.name}
                        </li>
                    ))
                ) : (
                    <p>No tags found</p>
                )}
            </ul>
        </aside>
    );
};

export default Aside;
