import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getCategoriesById,
    updateCategory,
} from "../../services/categoryService";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

const EditCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategory = async () => {
            if (!id) {
                setError("Category ID is missing.");
                setLoading(false);
                return;
            }

            try {
                const category = await getCategoriesById(id);
                setName(category.name);
            } catch (error) {
                console.error("Failed to load category:", error);
                setError("Failed to load category.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [id]);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!id) {
            return;
        }

        setError("");

        if (!name.trim()) {
            setError("Category name is required.");
            return;
        }

        try {
            setSaving(true);

            await updateCategory(id, {
                name: name.trim(),
            });

            navigate("/categories");
        } catch (error) {
            console.error("Failed to update category:", error);
            setError("Failed to update category.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="products-page">
                <Loading />
            </div>
        );
    }

    if (error && !name) {
        return (
            <div className="products-page">
                <ErrorMessage message={error} />
            </div>
        );
    }

    return (
        <div className="products-page">
            <div className="products-page__header">
                <div>
                    <h1>Edit Category</h1>
                    <p>Update category information.</p>
                </div>
            </div>

            <div className="products-card">
                <form className="product-form" onSubmit={handleSubmit}>
                    <div className="product-form__group product-form__full">
                        <label htmlFor="category-name">
                            Category Name
                        </label>

                        <input
                            type="text"
                            id="category-name"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="Enter category name"
                        />
                    </div>

                    {error && (
                        <div className="product-form__error">
                            {error}
                        </div>
                    )}

                    <div className="product-form__actions">
                        <button
                            type="button" className="btn btn--danger"
                            onClick={() => navigate("/categories")}
                        >
                            Cancel
                        </button>

                        <button type="submit" className="btn btn--primary" disabled={saving}>
                            {saving
                                ? "Updating..."
                                : "Update Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCategory;