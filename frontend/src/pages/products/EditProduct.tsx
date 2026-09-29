import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { getCategories, type Category } from "../../services/categoryService";
import { getSuppliers, type Supplier } from "../../services/supplierService";
import { getProductById, updateProduct } from "../../services/productService";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

const EditProduct = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [sku, setSku] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [minStock, setMinStock] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [supplierId, setSupplierId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if(!id) {
                setError("Product ID not found.");
                setLoading(false);
                return;
            }
            try {
                const [product, categoriesData, suppliersData] = await Promise.all([
                    getProductById(id),
                    getCategories(),
                    getSuppliers()
                ]);
                setName(product.name);
                setDescription(product.description);
                setSku(product.sku);
                setPrice(product.price);
                setQuantity(String(product.quantity));
                setMinStock(String(product.minStock));
                setCategoryId(String(product.categoryId));
                setSupplierId(String(product.supplierId));
                setCategories(categoriesData);
                setSuppliers(suppliersData);
            } catch (error) {
                console.error("Failed to load product:", error);
                setError("Failed to load product.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitError("");
        if(!name || !sku || !categoryId || !price || !supplierId ) {
            setSubmitError("Please fill all required fields.");
            return;
        }
        try {
            setSaving(true);
            await updateProduct(id!, {
                name, description, sku, price: Number(price), quantity: Number(quantity), minStock: Number(minStock), categoryId, supplierId
            });
            navigate("/products");
        } catch (error) {
            console.error("Failed to update product:", error);
            setSubmitError("Failed to update product.");            
        } finally {
            setSaving(false);
        }
    };

    if(loading) {
        return (
            <div className="products-page"><Loading /></div>
        );
    }

    if(error) {
        return (
            <div className="products-page"><ErrorMessage message={error} /></div>
        );
    }

  return (
    <div className="products-page">
        <div className="products-page__header">
            <div><h1>Edit Product</h1><p>Update product information.</p></div>    
            <button type="button" onClick={() => navigate("/products")}>Back to Products</button>
        </div>      
        <div className="products-card">
            <form className="product-form" onSubmit={handleSubmit}>
                {submitError && (
                    <div className="product-form__error">{submitError}</div>
                )}
                <div className="product-form__group">
                    <label htmlFor="">Product Name</label>
                    <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
                </div>

                <div className="product-form__group">
                    <label htmlFor="">SKU</label>
                    <input type="text" value={sku} onChange={(event) => setSku(event.target.value)} />
                </div>

                <div className="product-form__group product-form__full">
                    <label htmlFor="">Description</label>
                    <input type="text" value={description} onChange={(event) => setDescription(event.target.value)} />
                </div>

                <div className="product-form__group">
                    <label htmlFor="">Price</label>
                    <input type="number" value={price} onChange={(event) => setPrice(event.target.value)} />
                </div>

                <div className="product-form__group">
                    <label htmlFor="">Quantity</label>
                    <input type="number" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
                </div>

                <div className="product-form__group">
                    <label htmlFor="">Minimum Stock</label>
                    <input type="number" value={minStock} onChange={(event) => setMinStock(event.target.value)} />
                </div>

                <div className="product-form__group">
                    <label htmlFor="">Category</label>
                    <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>

                <div className="product-form__group">
                    <label htmlFor="">Supplier</label>
                    <select value={supplierId} onChange={(event) => setSupplierId(event.target.value)}>
                        <option value="">Select Supplier</option>
                        {suppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                        ))}
                    </select>
                </div>

                <div className="product-form__actions">
                    <button type="button" onClick={() => navigate("/products")}>Cancel</button>
                    <button type="submit" disabled={saving}>{saving ? "Updating..." : "Update Product"}</button>
                </div>

            </form>
        </div>
    </div>
  );
}
export default EditProduct