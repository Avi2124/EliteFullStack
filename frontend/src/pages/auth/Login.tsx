import { AlertTriangle, LockKeyhole, Mail, Package } from "lucide-react";
import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { loadUser } = useAuth();

    const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        try {
            const res = await loginUser({email, password});
            localStorage.setItem("accessToken", res);
            await loadUser();
            navigate("/dashboard");
        } catch {
            setError("Invalid Email or Password");
        }
        // console.log({email, password});
    };

    return (
        <main className="login-page">
            <div className="login-container">
                <section className="login-info">
                    <div className="login-info__brand">
                        <div className="login-info__logo">
                            <a href="#"><img src="logo2.png" alt="logo" width="250px" /></a>
                        </div>
                    </div>

                    <div className="login-info__content">
                        <h1>Welcome Back</h1>
                        <p>Sign in to your account to continue managing your inventory.</p>
                        <div className="login-feature">
                            <div className="login-feature__icon">
                                <Package size={16} />
                            </div>

                            <div>
                                <strong>Track Stock</strong>
                                <span>Real-time inventory tracking</span>
                            </div>
                        </div>

                        <div className="login-feature">
                            <div className="login-feature__icon">
                                <Package size={16} />
                            </div>
                            <div>
                                <strong>Manage Products</strong>
                                <span>Organize your products easily</span>
                            </div>
                        </div>

                        <div className="login-feature">
                            <div className="login-feature__icon">
                                <Package size={16} />
                            </div>
                            <div>
                                <strong>Manage Inventory</strong>
                                <span>Keep your stock organized</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="login-form-section">
                    <div className="login-form-container">
                        <h2>Sign In</h2>
                        <p className="login-form-description">Enter your email and password to access your account</p>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="login-input">
                                    <Mail size={16} />
                                    <input type="email" id="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="login-input">
                                    <LockKeyhole size={16} />
                                    <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required />
                                </div>
                                {error && (
                                <div className="login-error">
                                    <AlertTriangle size={16} color="red" />{error}
                                </div>
                            )}
                            </div>
                            <button type="submit" className="btn btn--primary login-button">Sign In</button>
                        </form>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Login