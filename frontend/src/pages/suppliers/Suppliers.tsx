import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    deleteSupplier,
    getSuppliers,
    type Supplier,
} from "../../services/supplierService";
import { Edit, Trash } from "lucide-react";
import Loading from "../../components/common/Loading";
import { useAuth } from "../../context/AuthContext";
import ErrorMessage from "../../components/common/ErrorMessage";

const Suppliers = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteError, setDeleteError] = useState("");

    const canCreate =
        user?.role === "ADMIN" || user?.role === "MANAGER";

    const canEdit =
        user?.role === "ADMIN" || user?.role === "MANAGER";

    const canDelete = user?.role === "ADMIN";

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this supplier?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleteError("");

            await deleteSupplier(id);

            setSuppliers((currentSuppliers) =>
                currentSuppliers.filter(
                    (supplier) => supplier.id !== id
                )
            );
        } catch (error) {
            console.error("Failed to delete supplier:", error);
            setDeleteError(
                "Failed to delete supplier. It may be used by existing products."
            );
        }
    };

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getSuppliers();

                setSuppliers(data);
            } catch (error) {
                console.error("Failed to load suppliers:", error);
                setError("Failed to load suppliers.");
            } finally {
                setLoading(false);
            }
        };

        fetchSuppliers();
    }, []);

    if (loading) {
        return (
            <div className="suppliers-page">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="suppliers-page">
                <ErrorMessage message={error} />
            </div>
        );
    }

    return (
        <div className="suppliers-page">
            <div className="suppliers-page__header">
                <div>
                    <h1>Suppliers</h1>
                    <p>Manage your product suppliers.</p>
                </div>

                {canCreate && (
                    <button
                        type="button" className="btn btn--primary"
                        onClick={() => navigate("/suppliers/create")}
                    >
                        Add Supplier
                    </button>
                )}
            </div>

            <div className="suppliers-card">
                {deleteError && (
                    <ErrorMessage message={deleteError} />
                )}

                <div className="suppliers-table-wrapper">
                    <table className="suppliers-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                {user?.role === "ADMIN" && "MANAGER" && <th>Actions</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {suppliers.map((supplier) => (
                                <tr key={supplier.id}>
                                    <td>{supplier.name}</td>
                                    <td>{supplier.email}</td>
                                    <td>{supplier.phone}</td>
                                    {user?.role === "ADMIN" && "MANAGER" && <>
                                        <td>
                                        {canEdit && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/suppliers/${supplier.id}/edit`
                                                    )
                                                }
                                            >
                                                <Edit size={18} color="blue" />
                                            </button>
                                        )}

                                        {canDelete && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        supplier.id
                                                    )
                                                }
                                            >
                                                <Trash size={18} color="red"/>
                                            </button>
                                        )}
                                    </td>
                                    </>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Suppliers;