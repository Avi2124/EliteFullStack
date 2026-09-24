import { BarChart3, Boxes, ClipboardList, FileText, LayoutDashboard, Mail, Package, Truck, Users, X } from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuItems = [
    {
        label: "Dashboard",path: "/dashboard", icon: LayoutDashboard
    },
    {
        label: "Products", path: "/products", icon: Package
    },
    {
        label: "Categories", path: "/categories", icon: Boxes
    },
    {
        label: "Suppliers", path: "/suppliers", icon: Truck
    },
    {
        label: "Inventory", path: "/inventory", icon: ClipboardList
    }, 
    {
        label: "Transactions", path: "/transactions", icon: BarChart3
    },
    {
        label: "Users", path: "/users", icon: Users
    },
    {
        label: "Audit Logs", path: "/audit-logs", icon: FileText
    },
    {
        label: "Email", path: "/email", icon: Mail
    },
];

function Sidebar ({isOpen, onClose}: SidebarProps) {
  return (
    <>
        <div className={`sidebar-overlay ${isOpen ? "sidebar-overlay--visible" : ""}`} onClick={onClose} />
        <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
            <div className="sidebar__brand">
                <div className="sidebar__logo">
                    <img src="logo2.png" alt="logo" />
                </div>
                <button type="button" className="sidebar__close" onClick={onClose} aria-label="Close Sidebar"><X size={18} /></button>
            </div>

            <nav className="sidebar__nav">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink key={item.path} to={item.path} onClick={onClose} className={({isActive}) => `sidebar__link ${isActive ? "sidebar__link--active" : ""}`} ><Icon size={18} /><span>{item.label}</span></NavLink>
                    );
                })}
            </nav>
            <div className="sidebar__bottom">
                <div className="sidebar__user">
                    <div className="sidebar__avatar">A</div>
                    <div className="sidebar__user-info">
                        <strong>Avi Italiya</strong>
                        <span>Admin</span>
                    </div>
                </div>
            </div>
        </aside>
    </>
  )
}

export default Sidebar