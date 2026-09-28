import api from "./api";

export type UserRole = | "ADMIN" | "MANAGER" | "STAFF";
export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface UserResponse {
    success: boolean;
    message: string;
    data: {
        users: User[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}

interface CreateUserData {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

interface UpdateUserData {
    name?: string;
    email?: string;
    role?: UserRole;
}

export const getUsers = async (page = 1, limit = 10, search = "", role = "", isActive = "") => {
    const res = await api.get<UserResponse>("/api/users/get-all", {params: {page, limit, ...(search ? {search} : {}),
            ...(role ? {role} : {}), ...(isActive ? {isActive} : {})}});
    return res.data.data;
};

export const getUserById = async (id:string) => {
    const res = await api.get<UserResponse>(`/api/users/${id}`);
    return res.data.data;
};

export const createUser = async (data: CreateUserData) => {
    const res = await api.post<UserResponse>("/api/users/create", data);
    return res.data.data;
};

export const updateUser = async (id: string, data: UpdateUserData) => {
    const res = await api.put<UserResponse>(`/api/users/${id}`, data);
    return res.data.data; 
}

export const updateUserStatus = async (id: string, isActive: boolean) => {
    const res = await api.patch<UserResponse>(`/api/users/${id}/status`, {isActive});
    return res.data;
};

export const deleteUser = async (id: string) => {
    const res = await api.delete<UserResponse>(`/api/users/${id}`);
    return res.data;
};