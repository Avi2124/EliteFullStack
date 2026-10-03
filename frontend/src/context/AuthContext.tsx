import {
    createContext,
    useContext,
    useEffect,
    type ReactNode,
} from "react";

// import { getProfile, logoutUser, type User } from "../services/authService";
import { type User } from "../services/authService";
import { useAppDispatch, useAppSelector } from "../store/hooks";

import {loadUser, logout as logoutUserAction} from "../store/slices/authSlice";

interface AuthContextType { 
    user: User | null;
    loading: boolean;
    loadUser: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const loading = useAppSelector((state) => state.auth.loading);
    console.log("AUTH:", {
    user,
    loading,
});

    const handleLoadUser = async () => {
        await dispatch(loadUser());
    };

    const handleLogout = async () => {
        await dispatch(logoutUserAction());
    }

    useEffect(() => {
        void handleLoadUser();
    }, []);

    // const loadUser = async () => {
    //     const token = localStorage.getItem("accessToken");

    //     if (!token) {
    //         setUser(null);
    //         setLoading(false);
    //         return;
    //     }

    //     try {
    //         setLoading(true);
    //         const profile = await getProfile();
    //         setUser(profile);
    //     } catch (error) {
    //         console.error("Failed to load user:", error);
    //         setUser(null);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     void Promise.resolve().then(loadUser);
    // }, []);

    // const logout = async () => {
    //     try {
    //         await logoutUser();
    //     } catch (error) {
    //         console.error("Logout failed:", error);
    //     } finally {
    //         localStorage.removeItem("accessToken");
    //         setUser(null);
    //     }
    // };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                loadUser: handleLoadUser,
                logout: handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
};