import { useEffect, useState } from "react";
import { getProducts, type Product } from "../../services/productService";
import { type Category, getCategories } from "../../services/categoryService";
import { getSuppliers, type Supplier } from "../../services/supplierService";

function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierId, setSupplierId] = useState("");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts(
          1,
          100,
          searchQuery,
          categoryId,
          supplierId,
          "name",
          "asc",
        );

        setProducts(data.products);
      } catch (error) {
        console.error("Failed to load inventory:", error);

        setError("Failed to load inventory.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [searchQuery, categoryId, supplierId]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoryData, supplierData] = await Promise.all([
          getCategories(),
          getSuppliers(),
        ]);
        setCategories(categoryData);
        setSuppliers(supplierData);
      } catch (error) {
        console.error("Failed to load inventory filters:", error);
      }
    };
    fetchFilters();
  }, []);

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity === 0) {
      return "Out of Stock";
    }

    if (quantity < minStock) {
      return "Low Stock";
    }

    return "In Stock";
  };

  if (loading) {
    return <div>Loading inventory...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="inventory-page">
      <div className="inventory-page__header">
        <div>
          <h1>Inventory</h1>
          <p>Monitor your current product stock.</p>
        </div>
      </div>

      <div className="inventory-card">
        <div className="inventory-filters">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setSearchQuery(search);
              }
            }}
          />

          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <option value="">All Categories</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={supplierId}
            onChange={(event) => setSupplierId(event.target.value)}
          >
            <option value="">All Suppliers</option>

            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>
        <div className="inventory-table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Supplier</th>
                <th>Quantity</th>
                <th>Min Stock</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const status = getStockStatus(
                  product.quantity,
                  product.minStock,
                );

                return (
                  <tr key={product.id}>
                    <td>{product.name}</td>

                    <td>{product.sku}</td>

                    <td>{product.category.name}</td>

                    <td>{product.supplier.name}</td>

                    <td>{product.quantity}</td>

                    <td>{product.minStock}</td>

                    <td>
                      <span
                        className={`stock-status ${
                          status === "In Stock"
                            ? "stock-status--in-stock"
                            : status === "Low Stock"
                              ? "stock-status--low-stock"
                              : "stock-status--out-of-stock"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
