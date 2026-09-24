import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface LoginData {
    email: string;
    password: string;
}

interface LoginResponse {
    data: {
        accessToken :string;
    }
}

export const loginUser = async (data: LoginData): Promise<string> => {
    const res = await axios.post<LoginResponse>(
        `${API_URL}/api/auth/login`, data
    );
    return res.data.data.accessToken;
}