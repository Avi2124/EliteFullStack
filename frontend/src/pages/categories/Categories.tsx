import { useEffect, useState } from "react"
import { deleteCategory, getCategories, type Category } from "../../services/categoryService";
import { Edit, PlusCircle, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/common/Loading";


const Categories = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
        return <div><Loading /></div>;
    }

    if(error) {
        return <div>{error}</div>
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
            alert("Failed to delete category. It may be used by existing products.");
        }
    };

  return (
    <div className="categories-page">
        <div className="categories-page__header">
            <div>
                <h1>Categories</h1>
                <p>Manage your product categories.</p>
            </div>
            <button type="button" onClick={() => navigate("/categories/create")}><PlusCircle size={18}/> Add Category</button>
        </div>

        <div className="categories-card">
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
                                <button type="button" onClick={() => navigate(`/categories/${category.id}/edit`)} ><Edit size={18} color="blue"/></button>
                                <button type="button" onClick={() => handleDelete(category.id)}><Trash size={18} color="red"/></button>
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