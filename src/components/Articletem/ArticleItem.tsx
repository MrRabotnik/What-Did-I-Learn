import React from "react";
import IMAGES from "../../utils/images";
import "./ArticleItem.scss";

const ArticleItem = ({ item, setDeleteModalOpen, setDeletingItem, setEditingItem, setEditModalOpen }: any) => {
    return (
        <tr className="article-item">
            <td>{item.name}</td>
            <td>
                {item.categories.map((item: any) => (
                    <div
                        className="tag"
                        key={item._id}
                    >
                        {item.name}
                    </div>
                ))}
            </td>
            <td>{new Date(item.createdAt).toLocaleDateString("en-US")}</td>
            <td className="action">
                <img
                    src={IMAGES.editIcon}
                    alt="Edit icon"
                    onClick={() => {
                        setEditingItem(item);
                        setEditModalOpen((prev: boolean) => !prev);
                    }}
                />
                <img
                    src={IMAGES.trashIcon}
                    alt="Trash icon"
                    onClick={() => {
                        setDeleteModalOpen((prev: boolean) => !prev);
                        setDeletingItem(item);
                    }}
                />
            </td>
        </tr>
    );
};

export default ArticleItem;
