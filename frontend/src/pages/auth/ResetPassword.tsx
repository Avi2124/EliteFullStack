import { type FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/authService";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setMessage("");
        setError("");

        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }

        if (!newPassword || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const result = await resetPassword(
                token,
                newPassword
            );

            setMessage(result);

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (error) {
            console.error(
                "Reset password failed:",
                error
            );

            setError(
                "Invalid or expired reset token."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-card__header">
                    <h1>Reset Password</h1>

                    <p>
                        Enter your new password below.
                    </p>
                </div>

                {message && (
                    <div className="auth-message auth-message--success">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="auth-message auth-message--error">
                        {error}
                    </div>
                )}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-group">
                        <label htmlFor="newPassword">
                            New Password
                        </label>

                        <input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(event) =>
                                setNewPassword(event.target.value)
                            }
                            placeholder="Enter new password"
                            autoComplete="new-password"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(event.target.value)
                            }
                            placeholder="Confirm new password"
                            autoComplete="new-password"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary auth-form__button"
                        disabled={loading}
                    >
                        {loading
                            ? "Resetting..."
                            : "Reset Password"}
                    </button>
                </form>

                <div className="auth-card__footer">
                    <Link to="/login">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;