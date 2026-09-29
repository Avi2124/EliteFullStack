import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getUserById,
    updateUser,
    type UserRole,
} from "../../services/userService";
import Loading from "../../components/common/Loading";

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<UserRole>("STAFF");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) {
                setError("User ID is missing.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response = await getUserById(id);
                const user = "users" in response ? response.users[0] : response;

                if (!user) {
                    setError("User not found.");
                    return;
                }

                setName(user.name);
                setEmail(user.email);
                setRole(user.role);
            } catch (error) {
                console.error("Failed to load user:", error);
                setError("Failed to load user.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!id) {
            setError("User ID is missing.");
            return;
        }

        if (!name || !email) {
            setError("Please fill all required fields.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            await updateUser(id, {
                name,
                email,
                role,
            });

            navigate("/users");
        } catch (error) {
            console.error("Failed to update user:", error);
            setError("Failed to update user.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div><Loading /></div>;
    }

    return (
        <div className="products-page">
            <div className="products-page__header">
                <div>
                    <h1>Edit User</h1>
                    <p>Update user information and role.</p>
                </div>
            </div>

            <div className="products-card">
                <form className="product-form" onSubmit={handleSubmit}>

                    <div className="product-form__group">
                        <label htmlFor="name">Name</label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Enter user name"
                        />
                    </div>

                    <div className="product-form__group">
                        <label htmlFor="email">Email</label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Enter email"
                        />
                    </div>

                    <div className="product-form__group">
                        <label htmlFor="role">Role</label>

                        <select
                            id="role"
                            value={role}
                            onChange={(event) =>
                                setRole(event.target.value as UserRole)
                            }
                        >
                            <option value="STAFF">Staff</option>
                            <option value="MANAGER">Manager</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    {error && (
                        <p className="product-form__error">
                            {error}
                        </p>
                    )}

                    <div className="product-form__actions">
                        <button
                            type="button"
                            onClick={() => navigate("/users")}
                        >
                            Cancel
                        </button>

                        <button type="submit" disabled={saving}>
                            {saving ? "Updating..." : "Update User"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditUser;