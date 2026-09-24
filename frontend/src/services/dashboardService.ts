import api from "./api";

export interface DashboardData {
    data: DashboardData | PromiseLike<DashboardData>;
    totalProducts: number;
    totalCategories: number;
    totalSuppliers: number;
    totalStock: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    getAllUsers: {
        totalUsers: number;
        admin: number;
        manager: number;
        staff: number;
    };
}

export const getDashboard = async (): Promise<DashboardData> => {
    const res = await api.get<DashboardData> (
        `/api/dashboard`
    );
    return res.data.data;
};