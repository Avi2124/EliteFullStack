import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { getSuppliers, type Supplier } from "../../services/supplierService";
import { Edit, Trash } from "lucide-react";

const Suppliers = () => {
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    if(loading) {
        return <div>Loading suppliers...</div>;
    }

    if(error) {
        return <div>{error}</div>;
    }
  return (
    <div className="suppliers-page">
        <div className="suppliers-page__header">
            <div>
                <h1>Suppliers</h1>
                <p>Manage your product suppliers.</p>
            </div>

            <button type="button" onClick={() => navigate("/suppliers/create")}>Add Supplier</button>
        </div>

        <div className="suppliers-card">
            <div className="suppliers-table-wrapper">
                <table className="suppliers-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map((supplier) => (
                            <tr key={supplier.id}>
                                <td>{supplier.name}</td>
                                <td>{supplier.email}</td>
                                <td>{supplier.phone}</td>
                                <td>
                                    <button type="button" onClick={() => navigate(`/suppliers/${supplier.id}/edit`)}><Edit size={18} color="blue" /></button>
                                    <button type="button"><Trash size={18} color="red" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}

export default Suppliers;