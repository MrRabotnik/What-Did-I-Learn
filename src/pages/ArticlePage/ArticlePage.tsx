import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axios.interceptor";
import "./ArticlePage.scss";

interface Article {
    name: string;
    createdAt: string;
    categories: string[];
    text: string;
}

const ArticlePage = () => {
    const { id } = useParams();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            setLoading(true);
            axiosInstance
                .get(`/articles/${id}`)
                .then((response) => {
                    if (response.data.success) {
                        setArticle(response.data.data);
                    }
                })
                .catch((err) => {
                    setError("Error fetching article");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!article) {
        return <p>Article not found</p>;
    }

    return (
        <div className="article-detail">
            <h1 className="article-name">{article.name}</h1>
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
            <div className="article-text">
                <p dangerouslySetInnerHTML={{ __html: article.text }}></p>
            </div>
        </div>
    );
};

export default ArticlePage;
