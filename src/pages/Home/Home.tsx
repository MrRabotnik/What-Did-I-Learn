import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../utils/axios.interceptor";
import Aside from "../../components/Aside/Aside";
import SearchDebounce from "../../utils/searchDebounce";
import "./Home.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { RiseLoader } from "react-spinners";

interface Article {
    name: string;
    createdAt: string;
    categories: string[];
    _id: string;
}

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const categoryFilter = queryParams.get("category_id");

    const [articles, setArticles] = useState<Article[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [finalSearchTerm, setFinalSearchTerm] = useState("");
    const [pending, setPending] = useState(true);

    useEffect(() => {
        const searchQuery = finalSearchTerm.length ? `search_term=${finalSearchTerm}` : "";
        const categoryQuery = categoryFilter ? `&category_id=${categoryFilter}` : "";

        const query = `${searchQuery}${categoryQuery}`;

        axiosInstance
            .get(`/articles/search?${query}`)
            .then((response) => {
                if (response.data.success) {
                    setArticles(response.data.data.docs);
                }
            })
            .catch((error) => {
                console.error("Error fetching articles:", error);
            })
            .finally(() => {
                setPending(false);
            });
    }, [categoryFilter, finalSearchTerm]);

    const debouncedSearch = useRef(SearchDebounce(setFinalSearchTerm, 1000)).current;

    return (
        <div className="home">
            <Aside />
            <div className="article-section">
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => {
                            debouncedSearch(e.target.value);
                            setSearchTerm(e.target.value);
                        }}
                        className="search-input"
                    />
                </div>

                <div className="articles-container">
                    {articles?.length > 0 ? (
                        articles.map((article: Article) => (
                            <div
                                key={article.name}
                                className="article-block"
                                onClick={() => navigate(`/article/${article._id}`)}
                            >
                                <h3 className="article-name">{article.name}</h3>
                                <p className="article-date">{new Date(article.createdAt).toLocaleDateString()}</p>
                                <div className="article-categories">
                                    {article.categories.map((category: any) => (
                                        <span
                                            key={category}
                                            className="category-tag"
                                        >
                                            {category.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : pending ? (
                        <div className="loader-container">
                            <RiseLoader
                                color="#d8d8d8"
                                size={10}
                            />
                        </div>
                    ) : (
                        <p>No articles found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
