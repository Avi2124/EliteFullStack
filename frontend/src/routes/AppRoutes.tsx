import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Login from "../pages/auth/Login"
import DashboardLayout from "../components/layout/DashboardLayout"
import Dashboard from "../pages/dashboard/Dashboard"
import ProtectedRoute from "./ProtectedRoute"
import Products from "../pages/products/Products"
import CreateProduct from "../pages/products/CreateProduct"
import EditProduct from "../pages/products/EditProduct"
import Categories from "../pages/categories/Categories"
import CreateCategory from "../pages/categories/CreateCategory"
import EditCategory from "../pages/categories/EditCategory"
import Suppliers from "../pages/suppliers/Suppliers"
import CreateSupplier from "../pages/suppliers/CreateSupplier"
import EditSupplier from "../pages/suppliers/EditSupplier"
import Inventory from "../pages/inventory/Inventory"

const AppRoutes = () => {
  return (  
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />} >
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/create" element={<CreateProduct />} />
                    <Route path="/products/:id/edit" element={<EditProduct />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/categories/create" element={<CreateCategory />} />
                    <Route path="/categories/:id/edit" element={<EditCategory />} />
                    <Route path="/suppliers" element={<Suppliers />} />
                    <Route path="/suppliers/create" element={<CreateSupplier />} />
                    <Route path="/suppliers/:id/edit" element={<EditSupplier />} />
                    <Route path="/inventory" element={<Inventory />} />
                </Route>
            </Route>
            
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes