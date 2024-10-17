import React, { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "../../utils/axios.interceptor";
import Aside from "../../components/Aside/Aside";
import SearchDebounce from "../../utils/searchDebounce";
import "./Home.scss";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RiseLoader } from "react-spinners";
import ReactPaginate from "react-paginate";

interface Article {
    name: string;
    createdAt: string;
    categories: string[];
    _id: string;
}

const Home = () => {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const categoryFilter: any = searchParams.get("category_id") || "";

    const page: any = searchParams.get("page") || 1;
    const itemsPerPage = 12;
    const [selectedPage, setSelectedPage] = useState(page ? parseInt(page) : 1);
    const [totalPages, setTotalPages] = useState(0);

    const [articles, setArticles] = useState<Article[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [finalSearchTerm, setFinalSearchTerm] = useState("");
    const [pending, setPending] = useState(true);

    const generateQuery = useCallback(
        (page: number) => {
            const pageQuery = `page=${page}`;
            const limitQuery = `&limit=${itemsPerPage}`;
            const categoryQuery = categoryFilter && categoryFilter !== "All" ? `&category_id=${categoryFilter}` : "";
            const searchTermQuery = finalSearchTerm ? `&search_term=${finalSearchTerm}` : "";

            return `${pageQuery}${limitQuery}${categoryQuery}${searchTermQuery}`;
        },
        [categoryFilter, finalSearchTerm]
    );

    useEffect(() => {
        setPending(true);
        setArticles([]);
        const query = generateQuery(selectedPage);

        axiosInstance
            .get(`/articles/search?${query}`)
            .then((response) => {
                if (response.data.success) {
                    setArticles(response.data.data.docs);
                    setTotalPages(response.data.data.totalPages);
                }
            })
            .catch((error) => {
                console.error("Error fetching articles:", error);
            })
            .finally(() => {
                setPending(false);
            });
    }, [categoryFilter, finalSearchTerm, generateQuery, selectedPage]);

    const handlePageClick = (e: any) => {
        setSelectedPage(e.selected + 1);
        navigate(`?${generateQuery(e.selected + 1)}`);
    };

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
                    {pending ? (
                        <div className="loader-container">
                            <RiseLoader
                                color="#d8d8d8"
                                size={10}
                            />
                        </div>
                    ) : articles?.length > 0 ? (
                        articles.map((article: Article) => (
                            <div
                                key={article._id}
                                className="article-block"
                                onClick={() => navigate(`/article/${article._id}`)}
                            >
                                <h3 className="article-name">{article.name}</h3>
                                <p className="article-date">{new Date(article.createdAt).toLocaleDateString()}</p>
                                <div className="article-categories">
                                    {article.categories.map((category: any) => (
                                        <span
                                            key={category._id}
                                            className="category-tag"
                                        >
                                            {category.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No articles found</p>
                    )}
                </div>
                {totalPages > 1 && (
                    <div className="pagination">
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel=">"
                            onPageChange={(e) => handlePageClick(e)}
                            pageRangeDisplayed={3}
                            pageCount={totalPages}
                            previousLabel="<"
                            renderOnZeroPageCount={null}
                            activeClassName={"selected-page"}
                            forcePage={selectedPage - 1 > totalPages ? 0 : selectedPage - 1}
                            previousClassName={selectedPage === 1 ? "disabled" : ""}
                            nextClassName={selectedPage === totalPages ? "disabled" : ""}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
