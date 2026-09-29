import { useEffect, useState } from "react"
import { type AuditLog, getAuditLogs } from "../../services/auditLogService";
import Loading from "../../components/common/Loading";

const AuditLogs = () => {

    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [action, setAction] = useState("");
    const [entity, setEntity] = useState("");
    const [userId] = useState("");

    useEffect(() => {
        const fetchAuditLogs = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getAuditLogs(page, limit, action, entity, userId);
                setLogs(data.logs);
                setTotalPages(data.pagination.totalPages);
            } catch (error) {
                console.error("Failed to load audit logs:", error);
                setError("Failed to load audit logs.");
            } finally {
                setLoading(false);
            }
        };
        fetchAuditLogs();
    }, [page, limit, action, entity, userId]);

    const formatDate = (date:string) => {
        return new Date(date).toLocaleString();
    };

    const formatAction = (value:string) => {
        return value .replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const handleActionChange = (value:string) => {
        setAction(value);
        setPage(1);
    };

    const handleEntityChange = (value:string) => {
        setEntity(value);
        setPage(1);
    };

    if(error) {
        return (
            <div className="audit-logs-page">
                <div className="audit-logs-card">{error}</div>
            </div>
        );
    }

  return (
    <div>
    <div className="audit-logs-page">
        <div className="audit-logs-page__header">
            <div>
                <h1>Audit Logs</h1>
                <p>Track all system activities.</p>
            </div>
        </div>

        <div className="audit-logs-filters">
            <select value={action} onChange={(event) => handleActionChange(event.target.value)}>
                <option value="">All Actions</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
                <option value="ACTIVATE">Activate</option>
                <option value="DEACTIVATE">Deactivate</option>
            </select>

            <select value={entity} onChange={(event) => handleEntityChange(event.target.value)}>
                <option value="">All Entities</option>
                <option value="USER">User</option>
                <option value="Product">Product</option>
                <option value="Category">Category</option>
                <option value="Supplier">Supplier</option>
                <option value="InventoryTransaction">Inventory Transaction</option>
            </select>
        </div>

        <div className="audit-logs-card">
            <div className="audit-logs-table-wrapper">
                <table className="audit-logs-table">
                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>User</th>
                            <th>Action</th>
                            <th>Entity</th>
                            <th>Details</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="audit-logs-table__loading"><Loading /></td>
                            </tr>
                        ): logs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="audit-logs-table__empty">No audit logs found.</td>
                            </tr>
                        ): (
                            logs.map((log) => (
                                <tr key={log.id}>
                                    <td>{formatDate(log.createdAt)}</td>
                                    <td>{log.user ? log.user.name : "System"}</td>
                                    <td>
                                        <span className={`audit-log-action audit-log-action--${log.action.toLowerCase()}`}>
                                            {formatAction(log.action)}
                                        </span>
                                    </td>
                                    <td>{formatAction(log.entity)}</td>
                                    <td>{log.details || "-"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="audit-logs-pagination">
                    <button type="button" disabled={page === 1} onClick={() => setPage((currentPage) => currentPage - 1)}>Previous</button>
                    <span>Page {page} of {" "} {totalPages}</span>
                    <button type="button" disabled={page === totalPages} onClick={() => setPage((currentPage) => currentPage + 1)}>Next</button>
            </div>
        </div>
    </div>
    </div>
  );
};
export default AuditLogs;