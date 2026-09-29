import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom"
import { type Category, getCategories } from "../../services/categoryService";
import { getSuppliers, type Supplier } from "../../services/supplierService";
import { createProduct } from "../../services/productService";

const CreateProduct = () => {

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesData, suppliersData] = await Promise.all([
                    getCategories(),
                    getSuppliers()
                ]);
                setCategories(categoriesData);
                setSuppliers(suppliersData);
            } catch (error) {
                console.error("Failed to load categories or suppliers:", error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        if(!name || !sku || !price || !categoryId || !supplierId) {
            setError("Please fill all required fields.");
            return;
        }
        try {
            setLoading(true);
            const product = await createProduct({
                name, description, sku, price: Number(price), quantity: Number(quantity), minStock: Number(minStock), categoryId, supplierId
            });
            console.log("Product created:", product);
            navigate("/products");
        } catch (error) {
            console.error("Failed to create product:", error);
            setError("Failed to create product.");
        } finally {
            setLoading(false);
        }
        console.log({name, description, sku, price, quantity, minStock, categoryId, supplierId});
    };

  return (
    <div className="products-page">
        <div className="products-page__header">
            <div    >
                <h1>Create Product</h1>
                <p>Add a new product to your inventory.</p>
            </div>
            <button type="button" className="btn btn--secondary" onClick={() => navigate("/products")}>Back to Products</button>
        </div>      

        <div className="products-card">
            <form className="product-form" onSubmit={handleSubmit}>
                {error && (
                    <div className="product-form__error">
                        {error}
                    </div>
                )}
                <div className="product-form__group">
                    <label htmlFor="name">Product Name</label>
                    <input type="text" id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter product name" />
                </div>

                <div className="product-form__group">
                    <label htmlFor="description">Description</label>
                    <textarea value={description} id="description" onChange={(event) => setDescription(event.target.value)} placeholder="Enter product description" />
                </div>

                <div className="product-form__group">
                    <label htmlFor="sku">SKU</label>
                    <input type="text" id="sku" value={sku} onChange={(event) => setSku(event.target.value)} placeholder="Enter SKU" />
                </div>

                <div className="product-form__group">
                    <label htmlFor="price">Price</label>
                    <input type="number" id="price" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="Enter price" />
                </div>

                <div className="product-form__group">
                    <label htmlFor="qty">Quantity</label>
                    <input type="number" id="qty" value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="Enter quantity" />
                </div>

                <div className="product-form__group">
                    <label htmlFor="minStock">Minimum Stock</label>
                    <input type="number" id="minStock" value={minStock} onChange={(event) => setMinStock(event.target.value)} placeholder="Enter minimum stock" />
                </div>

                <div className="product-form__group">
                    <label htmlFor="category">Category</label>
                    <select value={categoryId} id="category" onChange={(event) => setCategoryId(event.target.value)}>
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>

                <div className="product-form__group">
                    <label htmlFor="supplier">Supplier</label>
                    <select value={supplierId} id="supplier" onChange={(event) => setSupplierId(event.target.value)}>
                        <option value="">Select Supplier</option>
                        {suppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn--primary" disabled={loading}>{loading ? "Creating..." : "Create Product"}</button>
            </form>
        </div>
    </div>
  );
}
export default CreateProduct