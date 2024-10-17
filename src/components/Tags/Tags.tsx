import React, { useEffect, useState } from "react";
import "./Tags.scss";
import axiosInstance from "../../utils/axios.interceptor";
import IMAGES from "../../utils/images";

interface Tag {
    name: string;
    _id: string;
}

const Tags = () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [pending, setPending] = useState(true);
    const [newTag, setNewTag] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setPending(true);
        axiosInstance
            .get(`/tags`)
            .then((res) => {
                const data = res.data;
                if (data.success) {
                    setTags(data.data.docs);
                }
            })
            .catch((err) => {
                console.log(err);
                setError("Failed to load tags");
            })
            .finally(() => {
                setPending(false);
            });
    }, []);

    const handleAddTag = () => {
        if (newTag.length < 2) return;

        if (newTag.trim()) {
            setPending(true);
            axiosInstance
                .post("/tags", { name: newTag })
                .then((res) => {
                    if (res.data.success) {
                        setTags((prevTags) => [...prevTags, res.data.data]);
                        setNewTag("");
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setError("Failed to create tag");
                })
                .finally(() => {
                    setPending(false);
                });
        } else {
            setError("Tag name cannot be empty");
        }
    };

    const handleDeleteTag = (id: string) => {
        setPending(true);
        axiosInstance
            .delete(`/tags/${id}`)
            .then((res) => {
                if (res.data.success) {
                    setTags((prevTags) => prevTags.filter((tag) => tag._id !== id));
                }
            })
            .catch((err) => {
                console.log(err);
                setError("Failed to delete tag");
            })
            .finally(() => {
                setPending(false);
            });
    };

    return (
        <div className="tags-container">
            <h2>Tags</h2>

            <div className="tag-input-container">
                <input
                    type="text"
                    value={newTag}
                    onChange={(e) => {
                        setNewTag(e.target.value);
                        setError(null);
                    }}
                    placeholder="Enter tag name"
                />
                <button onClick={handleAddTag}>Add Tag</button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {pending ? (
                <div>Loading tags...</div>
            ) : (
                <div className="tags-list">
                    {tags.map((tag: Tag) => (
                        <div
                            key={tag._id}
                            className="tag-item"
                        >
                            {tag.name}
                            <img
                                src={IMAGES.closeIconWhite}
                                alt="Delete"
                                className="delete-icon"
                                onClick={() => handleDeleteTag(tag._id)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tags;
