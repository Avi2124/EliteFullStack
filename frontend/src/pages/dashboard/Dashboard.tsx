import { Boxes, Package, Truck, Warehouse, AlertTriangle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboard, type DashboardData } from "../../services/dashboardService";
import Loading from "../../components/common/Loading";

function Dashboard() {
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const data = await getDashboard();
                console.log("Dashboard API response:", data);

                setDashboard(data);
            } catch (error) {
                console.error("Failed to load dashboard:", error);
                setError("Failed to load dahsboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if(loading) {
        return (
            <div className="dashboard-page"><p><Loading /></p></div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-page"><p>{error}</p></div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <span className="page-header__breadcrumb">Dashboard</span>
                <h1>Dashboard</h1>
                <p>Welcome back! Here's an overview of your inventory.</p>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-card__top">
                        <div className="stat-card__icon"><Package size={18} /></div>
                    </div>
                    <span className="stat-card__label">Total Products</span>
                    <strong className="stat-card__value">{dashboard?.totalProducts}</strong>
                </div>

                <div className="stat-card">
                    <div className="stat-card__top">
                        <div className="stat-card__icon"><Boxes size={18} /></div>
                    </div>
                    <span className="stat-card__label">Total Categories</span>
                    <strong className="stat-card__value">{dashboard?.totalCategories}</strong>
                </div>

                <div className="stat-card">
                    <div className="stat-card__top">
                        <div className="stat-card__icon"><Truck size={18} /></div>
                    </div>
                    <span className="stat-card__label">Total Suppliers</span>
                    <strong className="stat-card__value">{dashboard?.totalSuppliers}</strong>
                </div>

                <div className="stat-card">
                    <div className="stat-card__top">
                        <div className="stat-card__icon"><Warehouse size={18} /></div>
                    </div>
                    <span className="stat-card__label">Total Stock</span>
                    <strong className="stat-card__value">{dashboard?.totalStock}</strong>
                </div>
            </div>

            <div className="dashboard-content">
                <section className="dashboard-card">
                    <div className="dashboard-card__header">
                        <h2>Inventory Overview</h2>
                        <p>Current inventory status</p>
                    </div>

                    <div className="dashboard-overview">
                        <div className="overview-item">
                            <div className="overview-item__icon overview-item__icon--green"><Warehouse size={18} /></div>
                            <div>
                                <strong>{dashboard?.totalStock}</strong>
                                <span>Total Stock</span>
                            </div>
                        </div>

                        <div className="overview-item">
                            <div className="overview-item__icon overview-item__icon--red"><AlertTriangle size={18} /></div>
                            <div>
                                <strong>{dashboard?.lowStockProducts}</strong>
                                <span>Low Stock</span>
                            </div>
                        </div>

                        <div className="overview-item">
                            <div className="overview-item__icon overview-item__icon--blue"><XCircle size={18} /></div>
                            <div>
                                <strong>{dashboard?.outOfStockProducts}</strong>
                                <span>Out of Stock</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="dashboard-card">
                    <div className="dashboard-card__header">
                        <h2>Quick Information</h2>
                        <p>User overview</p>
                    </div>

                    <div className="quick-info">
                        <div>
                            <span>Total Users</span>
                            <strong>{dashboard?.getAllUsers.totalUsers}</strong>
                        </div>
                        <div>
                            <span>Admin</span>
                            <strong>{dashboard?.getAllUsers.admin}</strong>
                        </div>
                        <div>
                            <span>Manager</span>
                            <strong>{dashboard?.getAllUsers.manager}</strong>
                        </div>
                        <div>
                            <span>Staff</span>
                            <strong>{dashboard?.getAllUsers.staff}</strong>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
export default Dashboard;