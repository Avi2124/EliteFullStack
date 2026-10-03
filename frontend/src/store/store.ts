import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dashboardReducer from "./slices/dashboardSlice";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";
import supplierReducer from "./slices/supplierSlice";
import inventoryReducer from "./slices/inventorySlice";
import transactionReducer from "./slices/transactionSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
        product: productReducer,
        category: categoryReducer,
        supplier: supplierReducer,
        inventory: inventoryReducer,
        transaction: transactionReducer,
        user: userReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
