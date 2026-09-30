import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import {
    createUser,
    type UserRole,
} from "../../services/userService";

import ErrorMessage from "../../components/common/ErrorMessage";

const CreateUser = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<UserRole>("STAFF");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!name || !email || !password) {
            setError("Please fill all required fields.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await createUser({
                name,
                email,
                password,
                role,
            });

            navigate("/users");
        } catch (error) {
            console.error("Failed to create user:", error);
            setError("Failed to create user.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="products-page">
            <div className="products-page__header">
                <div>
                    <h1>Create User</h1>
                    <p>Add a new system user.</p>
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
                        <label htmlFor="password">Password</label>

                        <div className="product-form__password">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                placeholder="Enter password"
                            />

                            <button
                                type="button"
                                className="product-form__password-toggle"
                                onClick={() =>
                                    setShowPassword((prev) => !prev)
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={17} />
                                ) : (
                                    <Eye size={17} />
                                )}
                            </button>
                        </div>
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

                    {error && <ErrorMessage message={error} />}

                    <div className="product-form__actions">
                        <button
                            className="btn btn--danger"
                            type="button"
                            onClick={() => navigate("/users")}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn btn--primary"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUser;