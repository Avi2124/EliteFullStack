import { useEffect, useState } from "react";
import {
  deleteProduct,
  downloadProductTemplate,
  exportProducts,
  getProducts,
  importProducts,
  type Product,
} from "../../services/productService";
import { type Category, getCategories } from "../../services/categoryService";
import { getSuppliers, type Supplier } from "../../services/supplierService";
import {
  Download,
  Edit,
  FileSpreadsheet,
  PlusCircle,
  Search,
  Trash,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useAuth } from "../../context/AuthContext";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [, setRefresh] = useState(0);
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
  const [deleteError, setDeleteError] = useState("");
  const { user } = useAuth();
  const canCreate = user?.role === "ADMIN" || user?.role === "MANAGER";
  const canEdit = user?.role === "ADMIN" || user?.role === "MANAGER";
  const canDelete = user?.role === "ADMIN";

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
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <ErrorMessage message={error} />
      </div>
    );
  }

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity === 0) {
      return {
        label: "Out of Stock",
        className: "stock-status--out-of-stock",
      };
    }

    if (quantity < minStock) {
      return {
        label: "Low Stock",
        className: "stock-status--low-stock",
      };
    }

    return {
      label: "In Stock",
      className: "stock-status--in-stock",
    };
  };

  const redirect = () => {
    navigate("/products/create");
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(id);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id),
      );
    } catch (error) {
      console.error("Failed to delete product:", error);
      setDeleteError("Failed to delete product.");
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportProducts();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "products.xlsx";
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export products:", error);
    }
  };

  const handleTemplateDownload = async () => {
    try {
      const blob = await downloadProductTemplate();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "product-template.xlsx";
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download product template:", error);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      await importProducts(file);

      setRefresh((current) => current + 1);
    } catch (error) {
      console.error("Failed to import products:", error);
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div className="products-page">
      <div className="products-page__header">
        <div>
          <h1>Products</h1>
          <p>Manage your inventory products.</p>
        </div>
        {canCreate && (
          <button onClick={redirect} className="btn btn--primary">
            <PlusCircle size={18} />
            Add Product
          </button>
        )}
      </div>
      <div className="products-card">
        {deleteError && <ErrorMessage message={deleteError} />}
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
          <div className="products-actions">
            {user?.role === "ADMIN" && (
              <>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={handleExport}
                >
                  <Download size={17} />
                  Export
                </button>

                <label className="btn btn--primary">
                  <Upload size={17} />
                  Import
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleImport}
                    hidden
                  />
                </label>
              </>
            )}

            {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
              <button
                type="button"
                className="btn btn--primary"
                onClick={handleTemplateDownload}
              >
                <FileSpreadsheet size={17} />
                Template
              </button>
            )}
          </div>
        </div>

        <div className="products-table-wrapper">
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
                {user?.role === "ADMIN" && "MANAGER" && <th>Actions</th>}
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
                  <td>
                    {(() => {
                      const status = getStockStatus(
                        product.quantity,
                        product.minStock,
                      );

                      return (
                        <span className={`stock-status ${status.className}`}>
                          {status.label}
                        </span>
                      );
                    })()}
                  </td>
                  {user?.role === "ADMIN" && "MANAGER" && <>
                  <td>
                    {canEdit && (
                      <button type="button">
                        <Edit
                          size={18}
                          color="blue"
                          onClick={() =>
                            navigate(`/products/${product.id}/edit`)
                          }
                        />
                      </button>
                    )}
                    {canDelete && (
                      <button type="button">
                        <Trash
                          size={18}
                          color="red"
                          onClick={() => handleDelete(product.id)}
                        />
                      </button>
                    )}
                  </td>
                  </>}
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="users-pagination">
          <button
            type="button"
            className="btn btn--primary"
            disabled={page === 1}
            onClick={() => setPage((currentPage) => currentPage - 1)}
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            className="btn btn--primary"
            disabled={page === totalPages}
            onClick={() => setPage((currentPage) => currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
