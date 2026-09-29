import { useEffect, useState, type FormEvent } from "react";
import { getInventoryTransactions, createInventoryTransaction, type InventoryTransaction, type InventoryTransactionType } from "../../services/inventoryTransactionService";
import { getProducts, type Product } from "../../services/productService";
import Loading from "../../components/common/Loading";
import { useAuth } from "../../context/AuthContext";
import { PlusCircle } from "lucide-react";
import ErrorMessage from "../../components/common/ErrorMessage";
function Transactions() {
    const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [refresh, setRefresh] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const limit = 10;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [transactionType, setTransactionType] = useState<InventoryTransactionType>("STOCK_IN");
    const [transactionProductId, setTransactionProductId] = useState("");
    const [transactionQuantity, setTransactionQuantity] = useState("");
    const [transactionRemarks, setTransactionRemarks] = useState("");
    const [transactionLoading, setTransactionLoading] = useState(false);
    const [transactionError, setTransactionError] = useState("");

    const { user } = useAuth();

    const canCreate = user?.role === "ADMIN" || user?.role === "MANAGER";

    useEffect(() => {
    const loadTransactions = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getInventoryTransactions(page, limit);
            setTransactions(data.transactions);
            setTotalPages(data.pagination.totalPages);
        } catch (error) {
            console.error("Failed to load transactions:", error);
            setError("Failed to load transaction history.");
        } finally {
            setLoading(false);
        }
    };
    loadTransactions();
}, [page, refresh]);

    const fetchProducts = async () => {
        try {
            const data = await getProducts(1,100,"","","","name","asc");
            setProducts(data.products);
        } catch (error) {
            console.error("Failed to load products:",error);
            setTransactionError("Failed to load products.");
        }
    };

    const handleOpenModal = () => {
        setTransactionType("STOCK_IN");
        setTransactionProductId("");
        setTransactionQuantity("");
        setTransactionRemarks("");
        setTransactionError("");
        setIsModalOpen(true);
        fetchProducts();
    };

    const handleCloseModal = () => {
        if (transactionLoading) {
            return;
        }
        setIsModalOpen(false);
        setTransactionError("");
    };

    const handleTransaction = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setTransactionError("");
        if (!transactionProductId) {
            setTransactionError("Please select a product.");
            return;
        }

        if (!transactionQuantity || Number(transactionQuantity) <= 0) {
            setTransactionError("Please enter a valid quantity.");
            return;
        }

        try {
            setTransactionLoading(true);
            await createInventoryTransaction({
                productId: transactionProductId,
                type: transactionType,
                quantity: Number(transactionQuantity),
                remarks: transactionRemarks,
            });
            setTransactionProductId("");
            setTransactionQuantity("");
            setTransactionRemarks("");
            setIsModalOpen(false);
            setRefresh((current) => current + 1);
        } catch (error) {
            console.error(
                "Failed to create transaction:",
                error
            );

            setTransactionError(
                "Failed to create transaction."
            );
        } finally {
            setTransactionLoading(false);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString();
    };

    if (loading) {
        return (
            <div className="transactions-page">
                <div className="transactions-card">
                    <Loading />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="transactions-page">
                <div className="transactions-card">
                    <ErrorMessage message={error} />
                </div>
            </div>
        );
    }

    return (
        <div className="transactions-page">

            {/* Page Header */}
            <div className="transactions-page__header">
                <div>
                    <h1>Transaction History</h1>

                    <p>
                        View all stock in and stock
                        out transactions.
                    </p>
                </div>

                {canCreate && (<button
                    type="button"
                    className="btn btn-primary myBtn"
                    onClick={handleOpenModal}
                >
                    <PlusCircle />Create Transaction
                </button>)}
            </div>

            {/* Transactions Card */}
            <div className="transactions-card">

                <div className="transactions-card__header">
                    <div>
                        <h2>Transactions</h2>

                        <p>
                            Complete inventory
                            transaction history.
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="transactions-table-wrapper">
                    <table className="transactions-table">

                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>SKU</th>
                                <th>Type</th>
                                <th>Quantity</th>
                                <th>Remarks</th>
                                <th>Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {transactions.length ===
                            0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        style={{
                                            textAlign:
                                                "center",
                                        }}
                                    >
                                        No transactions
                                        found.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map(
                                    (transaction) => (
                                        <tr
                                            key={
                                                transaction.id
                                            }
                                        >
                                            <td>
                                                {
                                                    transaction
                                                        .product
                                                        .name
                                                }
                                            </td>

                                            <td>
                                                {
                                                    transaction
                                                        .product
                                                        .sku
                                                }
                                            </td>

                                            <td>
                                                <span
                                                    className={`transaction-type ${
                                                        transaction.type ===
                                                        "STOCK_IN"
                                                            ? "transaction-type--in"
                                                            : "transaction-type--out"
                                                    }`}
                                                >
                                                    {transaction.type ===
                                                    "STOCK_IN"
                                                        ? "Stock In"
                                                        : "Stock Out"}
                                                </span>
                                            </td>

                                            <td>
                                                {
                                                    transaction.quantity
                                                }
                                            </td>

                                            <td>
                                                {
                                                    transaction
                                                        .remarks ||
                                                    "-"
                                                }
                                            </td>

                                            <td>
                                                {formatDate(
                                                    transaction.createdAt
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )
                            )}
                        </tbody>

                    </table>
                </div>

                {/* Pagination */}
                <div className="transactions-pagination">

                    <button
                        type="button"
                        disabled={page === 1}
                        onClick={() =>
                            setPage(
                                (currentPage) =>
                                    currentPage - 1
                            )
                        }
                    >
                        Previous
                    </button>

                    <span>
                        Page {page} of {totalPages}
                    </span>

                    <button
                        type="button"
                        disabled={
                            page === totalPages
                        }
                        onClick={() =>
                            setPage(
                                (currentPage) =>
                                    currentPage + 1
                            )
                        }
                    >
                        Next
                    </button>

                </div>

            </div>

            {/* Create Transaction Modal */}
            {isModalOpen && canCreate && (
                <div
                    className="transaction-modal"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            handleCloseModal();
                        }
                    }}
                >
                    <div className="transaction-modal__content">

                        {/* Modal Header */}
                        <div className="transaction-modal__header">

                            <div>
                                <h2>
                                    Create Transaction
                                </h2>

                                <p>
                                    Add or remove
                                    product stock.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="transaction-modal__close"
                                onClick={
                                    handleCloseModal
                                }
                                disabled={
                                    transactionLoading
                                }
                            >
                                ×
                            </button>

                        </div>

                        {/* Form */}
                        <form
                            className="transaction-form"
                            onSubmit={
                                handleTransaction
                            }
                        >

                            {/* Action */}
                            <div className="transaction-form__group">
                                <label htmlFor="transactionType">
                                    Action *
                                </label>

                                <select
                                    id="transactionType"
                                    value={
                                        transactionType
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setTransactionType(
                                            event.target
                                                .value as InventoryTransactionType
                                        )
                                    }
                                >
                                    <option value="STOCK_IN">
                                        Stock In
                                    </option>

                                    <option value="STOCK_OUT">
                                        Stock Out
                                    </option>
                                </select>
                            </div>

                            {/* Product */}
                            <div className="transaction-form__group">
                                <label htmlFor="transactionProduct">
                                    Product *
                                </label>

                                <select
                                    id="transactionProduct"
                                    value={
                                        transactionProductId
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setTransactionProductId(
                                            event.target
                                                .value
                                        )
                                    }
                                >
                                    <option value="">
                                        Select product
                                    </option>

                                    {products.map(
                                        (
                                            product
                                        ) => (
                                            <option
                                                key={
                                                    product.id
                                                }
                                                value={
                                                    product.id
                                                }
                                            >
                                                {
                                                    product.name
                                                }{" "}
                                                (
                                                {
                                                    product.sku
                                                }
                                                )
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* Quantity */}
                            <div className="transaction-form__group">
                                <label htmlFor="transactionQuantity">
                                    Quantity *
                                </label>

                                <input
                                    id="transactionQuantity"
                                    type="number"
                                    min="1"
                                    placeholder="Enter quantity"
                                    value={
                                        transactionQuantity
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setTransactionQuantity(
                                            event.target
                                                .value
                                        )
                                    }
                                />
                            </div>

                            {/* Remarks */}
                            <div className="transaction-form__group">
                                <label htmlFor="transactionRemarks">
                                    Remarks
                                </label>

                                <textarea
                                    id="transactionRemarks"
                                    placeholder="Enter remarks"
                                    value={
                                        transactionRemarks
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setTransactionRemarks(
                                            event.target
                                                .value
                                        )
                                    }
                                />
                            </div>

                            {/* Error */}
                            {transactionError && (
                                <ErrorMessage message={transactionError} />
                            )}

                            {/* Actions */}
                            <div className="transaction-form__actions">

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={
                                        handleCloseModal
                                    }
                                    disabled={
                                        transactionLoading
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={
                                        transactionLoading
                                    }
                                >
                                    {transactionLoading
                                        ? "Creating..."
                                        : "Create Transaction"}
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Transactions;