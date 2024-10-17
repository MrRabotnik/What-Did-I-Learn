import React, { useCallback, useEffect, useState } from "react";
import "./KnowledgeCatalog.scss";
import IMAGES from "../../utils/images";
import SearchBox from "../SearchBox/SearchBox";
import SelectBox from "../SelectBox/SelectBox";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../utils/axios.interceptor";
import ReactPaginate from "react-paginate";
import { RiseLoader } from "react-spinners";
import ArticleItem from "../Articletem/ArticleItem";
import DeleteModal from "../DeleteModal/DeleteModal";
import Modal from "../Modal/Modal";
import ReactQuill from "react-quill";
import { toast } from "react-toastify";
import InputRow from "../InputRow/InputRow";
import Select, { InputActionMeta } from "react-select";
import checkValidation from "../../validations/article.validation";

interface Knowledge {
    name: string;
    category: string;
    date: string;
    description: string;
}

interface Tag {
    name: string;
    _id: string;
}

const KnowledgeCatalog = () => {
    const [knowledgeItems, setKnowledgeItems] = useState<Knowledge[]>([]);

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const page: any = searchParams.get("page") || 1;
    const itemsPerPage = 10;
    const [selectedPage, setSelectedPage] = useState(page ? parseInt(page) : 1);
    const [totalPages, setTotalPages] = useState(0);

    const [categories, setCategories] = useState<Tag[]>([]);
    const [categoriesOptions, setCategoriesOptions] = useState<any>([]);
    const [selectedCategory, setSelectedCategory] = useState<any>({ name: "Category" });

    const [update, setUpdate] = useState(false);
    const [pending, setPending] = useState(false);

    const [orderBy, setOrderBy] = useState("");
    const [orderType, setOrderType] = useState("desc");

    const [searchTerm, setSearchTerm] = useState("");
    const [submitedSearchTerm, setSubmitedSearchTerm] = useState("");

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [text, setText] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [editingName, setEditingName] = useState("");
    const [editingText, setEditingText] = useState("");
    const [editingSelectedCategories, setEditingSelectedCategories] = useState([]);

    const [editingItem, setEditingItem] = useState<any>({});
    const [deletingItem, setDeletingItem] = useState<any>({});
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const generateQuery = useCallback(() => {
        const pageQuery = `page=${selectedPage}`;
        const limitQuery = `&limit=${itemsPerPage}`;
        const categoryQuery =
            selectedCategory._id && selectedCategory.name !== "Բոլորը" ? `&category_id=${selectedCategory._id}` : "";
        const orderByQuery = orderBy.length ? `&sort_by=${orderBy}` : "";
        const orderTypeQuery = `&sort_type=${orderType}`;
        const searchTermQuery = submitedSearchTerm ? `&search_term=${submitedSearchTerm}` : "";

        return `${pageQuery}${limitQuery}${categoryQuery}${orderByQuery}${orderTypeQuery}${searchTermQuery}`;
    }, [selectedPage, selectedCategory._id, selectedCategory.name, orderBy, orderType, submitedSearchTerm]);

    useEffect(() => {
        setKnowledgeItems([]);
        setPending(true);

        const query = generateQuery();

        axiosInstance
            .get(`/articles/search?${query}`)
            .then((res) => {
                const data = res.data;
                if (data.success) {
                    setKnowledgeItems(data.data.docs);
                    setTotalPages(data.data.totalPages);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setPending(false);
            });
    }, [update, generateQuery]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes] = await Promise.all([axiosInstance.get(`/tags`)]);

                if (categoriesRes.data.success) {
                    const arr = categoriesRes.data.data.docs;
                    const categories = [{ name: "All" }, ...arr];

                    const options = arr.map((tag: any) => ({
                        value: tag._id,
                        label: tag.name,
                    }));

                    setCategories(categories);
                    setCategoriesOptions(options);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!editingItem._id) return;

        setEditingName(editingItem.name);
        const options = editingItem.categories.map((tag: any) => ({
            value: tag._id,
            label: tag.name,
        }));

        setEditingSelectedCategories(options);
        setEditingText(editingItem.text);
    }, [editingItem]);

    const handleSubmit = () => {
        const valid = checkValidation(name, selectedCategories, text);
        if (!valid) return;

        const body = {
            name,
            text,
            categories: selectedCategories.map((item: any) => item.value),
        };

        axiosInstance
            .post(`/articles`, body)
            .then((res) => {
                const data = res.data;
                if (data.success) {
                    toast.success(data.message);
                    setAddModalOpen(false);
                    setUpdate((prev) => !prev);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleSubmitEdit = () => {
        const valid = checkValidation(editingName, editingSelectedCategories, editingText);
        if (!valid) return;

        const body = {
            name: editingName,
            text: editingText,
            categories: editingSelectedCategories.map((item: any) => item.value),
        };

        axiosInstance
            .put(`/articles/${editingItem._id}`, body)
            .then((res) => {
                const data = res.data;
                if (data.success) {
                    toast.success(data.message);
                    setEditModalOpen(false);
                    setUpdate((prev) => !prev);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handlePageClick = (e: any) => {
        setSelectedPage(e.selected + 1);
        navigate(`?page=${e.selected + 1}`);
    };

    return (
        <div className="articles-section">
            {addModalOpen && (
                <Modal
                    title={"Edit"}
                    closeModal={setAddModalOpen}
                    submitModal={handleSubmit}
                >
                    <InputRow
                        label={"Անուն (Հայերեն)"}
                        value={name}
                        placeholder={"Անուն (Հայերեն)"}
                        setValue={setName}
                    />

                    <Select
                        isMulti
                        options={categoriesOptions}
                        value={selectedCategories}
                        onChange={(val: any) => setSelectedCategories(val)}
                        placeholder="Select Tags"
                        inputValue={""}
                        onInputChange={function (newValue: string, actionMeta: InputActionMeta): void {}}
                        onMenuOpen={function (): void {}}
                        onMenuClose={function (): void {}}
                    />

                    <p>Text</p>
                    <ReactQuill
                        value={text}
                        onChange={setText}
                        placeholder="Description"
                        modules={{
                            toolbar: {
                                container: [
                                    ["bold", "italic", "underline", "strike", "blockquote"],
                                    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                                ],
                            },
                        }}
                    />
                </Modal>
            )}

            {editModalOpen && (
                <Modal
                    title={"Edit"}
                    closeModal={setEditModalOpen}
                    submitModal={handleSubmitEdit}
                >
                    <InputRow
                        label={"Անուն (Հայերեն)"}
                        value={editingName}
                        placeholder={"Անուն (Հայերեն)"}
                        setValue={setEditingName}
                    />

                    <Select
                        isMulti
                        options={categoriesOptions}
                        value={editingSelectedCategories}
                        onChange={(val: any) => setEditingSelectedCategories(val)}
                        placeholder="Select Tags"
                        inputValue={""}
                        onInputChange={function (newValue: string, actionMeta: InputActionMeta): void {}}
                        onMenuOpen={function (): void {}}
                        onMenuClose={function (): void {}}
                    />

                    <p>Text</p>
                    <ReactQuill
                        value={editingText}
                        onChange={setEditingText}
                        placeholder="Description"
                        modules={{
                            toolbar: {
                                container: [
                                    ["bold", "italic", "underline", "strike", "blockquote"],
                                    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                                ],
                            },
                        }}
                    />
                </Modal>
            )}

            {deleteModalOpen && (
                <DeleteModal
                    url={`/articles/${deletingItem._id}`}
                    setDeleteModalOpen={setDeleteModalOpen}
                    setUpdate={setUpdate}
                    title={deletingItem.name}
                    deletingItem={"ապրանքը"}
                    toastMessage={"Ապրանքը հաջողությամբ հեռացվեց"}
                />
            )}
            <div className="header">
                <h2>Articles</h2>
            </div>
            <div className="add-new-category-container">
                <button
                    onClick={() => setAddModalOpen(true)}
                    className="button"
                >
                    + Add new article
                </button>
            </div>
            <div className="search-sort-container">
                <SearchBox
                    placeholder={"Որոնել"}
                    value={searchTerm}
                    setValue={setSearchTerm}
                    setSubmitedSearchTerm={setSubmitedSearchTerm}
                    setPending={setPending}
                />
                <SelectBox
                    dropDownArray={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    callback={() => {
                        setSelectedPage(1);
                        navigate(`?page=${1}`);
                    }}
                />
            </div>
            <div className="search-and-filters-container"></div>
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="name">
                                <div>
                                    Name
                                    <img
                                        src={IMAGES.swapVertical}
                                        alt="Order by name"
                                        onClick={() => {
                                            setOrderBy("name");
                                            setOrderType((prev) => (prev === "asc" ? "desc" : "asc"));
                                        }}
                                    />
                                </div>
                            </th>
                            <th className="category">
                                <div>
                                    Categories
                                    <img
                                        src={IMAGES.swapVertical}
                                        alt="Order by category"
                                        onClick={() => {
                                            setOrderBy("category");
                                            setOrderType((prev) => (prev === "asc" ? "desc" : "asc"));
                                        }}
                                    />
                                </div>
                            </th>
                            <th className="date">
                                <div>
                                    Date
                                    <img
                                        src={IMAGES.swapVertical}
                                        alt="Order by date"
                                        onClick={() => {
                                            setOrderBy("date");
                                            setOrderType((prev) => (prev === "asc" ? "desc" : "asc"));
                                        }}
                                    />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {knowledgeItems?.length ? (
                            knowledgeItems.map((item, index) => {
                                return (
                                    <ArticleItem
                                        key={index}
                                        item={item}
                                        setDeleteModalOpen={setDeleteModalOpen}
                                        setDeletingItem={setDeletingItem}
                                        setEditingItem={setEditingItem}
                                        setEditModalOpen={setEditModalOpen}
                                    />
                                );
                            })
                        ) : pending ? (
                            <tr>
                                <td>
                                    <div className="loader-container">
                                        <RiseLoader
                                            color="#d8d8d8"
                                            size={10}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ) : !knowledgeItems?.length ? (
                            <tr>
                                <td>
                                    <p className="text-align-center">Ոչինչ չի գտնվել</p>
                                </td>
                            </tr>
                        ) : (
                            ""
                        )}
                    </tbody>
                </table>
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
    );
};

export default KnowledgeCatalog;
