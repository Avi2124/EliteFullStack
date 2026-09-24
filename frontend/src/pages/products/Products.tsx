import { useEffect, useState } from "react";
import { deleteProduct, getProducts, type Product } from "../../services/productService";
import { type Category, getCategories } from "../../services/categoryService";
import { getSuppliers, type Supplier } from "../../services/supplierService";
import { Edit, PlusCircle, Search, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierId, setSupplierId] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(
          page,
          10,
          searchQuery,
          categoryId,
          supplierId,
          sortBy,
          order,
        );
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error("Failed to load products:", error);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, searchQuery, categoryId, supplierId, sortBy, order]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getSuppliers();
        setSuppliers(data);
      } catch (error) {
        console.error("Failed to load suppliers:", error);
      }
    };
    fetchSuppliers();
  }, []);

  if (loading) {
    return (
      <div className="products-page">
        <h2>Loading Products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <h2>{error}</h2>
      </div>
    );
  }

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity === 0) {
      return "Out of Stock";
    }
    if (quantity < minStock) {
      return "Low Stock";
    }
    return "In Stock";
  };

  const redirect = () => {
    {navigate("/products/create")};
  }

  const handleDelete = async (id:string) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if(!confirmed) {
        return;
    }

    try {
        await deleteProduct(id);
        setProducts((currentProducts) => 
            currentProducts.filter((product) => product.id !== id)
        );
    } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Failed to delete product.");
    }
  };

  return (
    <div className="products-page">
      <div className="products-page__header">
        <div>
          <h1>Products</h1>
          <p>Manage you inventory products.</p>
        </div>
        <button onClick={redirect} className="add-product"><PlusCircle size={18} />Add Product</button>
      </div>
      <div className="products-card">
        <div className="products-filters">
          <div className="searchbar">
            <Search size={16} />
            <input
              type="text"
              
              placeholder="Search products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setPage(1);
                  setSearchQuery(search);
                }
              }}
            />
          </div>

          <div className="dropdown-menu">
            <select
              value={categoryId}
              onChange={(event) => {
                setCategoryId(event.target.value);
                setPage(1);
              }}
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
              onChange={(event) => {
                setSupplierId(event.target.value);
                setPage(1);
              }}
            >
              <option value="">All Suppliers</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
                setPage(1);
              }}
            >
              <option value="createdAt">Date Added</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="quantity">Quantity</option>
            </select>

            <select
              value={order}
              onChange={(event) => {
                setOrder(event.target.value);
                setPage(1);
              }}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        <div className="products table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Supplier</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Min Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>{product.category.name}</td>
                  <td>{product.supplier.name}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>{product.minStock}</td>
                  <td>{getStockStatus(product.quantity, product.minStock)}</td>
                  <td>
                    <button type="button"><Edit size={18} color="blue" onClick={() => navigate(`/products/${product.id}/edit`)} /></button>
                    <button type="button"><Trash size={18} color="red" onClick={() => handleDelete(product.id)} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="products-pagination">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
