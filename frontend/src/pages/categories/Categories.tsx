import { useEffect, useState } from "react"
import { deleteCategory, getCategories, type Category } from "../../services/categoryService";
import { Edit, PlusCircle, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/common/Loading";
import { useAuth } from "../../context/AuthContext";
import ErrorMessage from "../../components/common/ErrorMessage";


const Categories = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const { user } = useAuth();

    const canCreate = user?.role === "ADMIN" || user?.role === "MANAGER";
    const canEdit = user?.role === "ADMIN" || user?.role === "MANAGER";
    const canDelete = user?.role === "ADMIN";

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Failed to load categories:", error);
                setError("Failed to load categories");
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if(loading) {
        return (
        <div className="categories-page">
            <Loading />
        </div>
    );
    }

    if(error) {
        return (
        <div className="categories-page">
            <ErrorMessage message={error} />
        </div>
    );
    }

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this category?");
        if(!confirmed) {
            return;
        }

        try {
            await deleteCategory(id);
            setCategories((currentCategories) => currentCategories.filter((category) => category.id !== id));
        } catch (error) {
            console.error("Failed to delete category:", error);
            setDeleteError("Failed to delete category. It may be used by existing products.");
        }
    };

  return (
    <div className="categories-page">
        <div className="categories-page__header">
            <div>
                <h1>Categories</h1>
                <p>Manage your product categories.</p>
            </div>
            {canCreate && (<button type="button" onClick={() => navigate("/categories/create")}><PlusCircle size={18}/> Add Category</button>)}
        </div>

        <div className="categories-card">
            {deleteError && (
                <ErrorMessage message={deleteError} />
            )}
            <div className="categories-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category.id}>
                            <td>{category.name}</td>
                            <td>
                                {new Date(category.createdAt).toLocaleDateString()}
                            </td>
                            <td>
                                {canEdit && (<button type="button" onClick={() => navigate(`/categories/${category.id}/edit`)} ><Edit size={18} color="blue"/></button>)}
                                {canDelete && (<button type="button" onClick={() => handleDelete(category.id)}><Trash size={18} color="red"/></button>)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </div>
        </div>
    </div>
  );
}

export default Categories