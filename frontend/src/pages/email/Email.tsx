import { useState } from "react";

import {
    sendDailyInventorySummary,
    sendLowStockAlert,
    sendWeeklyInventoryReport,
} from "../../services/emailService";

const Email = () => {
    const [loading, setLoading] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSendEmail = async (
        type: "daily" | "low-stock" | "weekly"
    ) => {
        try {
            setLoading(type);
            setMessage("");
            setError("");

            if (type === "daily") {
                await sendDailyInventorySummary();
                setMessage("Daily inventory summary sent successfully.");
            }

            if (type === "low-stock") {
                await sendLowStockAlert();
                setMessage("Low stock alert sent successfully.");
            }

            if (type === "weekly") {
                await sendWeeklyInventoryReport();
                setMessage("Weekly inventory report sent successfully.");
            }
        } catch (error) {
            console.error("Failed to send email:", error);
            setError("Failed to send email. Please try again.");
        } finally {
            setLoading("");
        }
    };

    return (
        <div className="email-page">
            <div className="email-page__header">
                <div>
                    <h1>Email Reports</h1>
                    <p>Send inventory reports to the administrator.</p>
                </div>
            </div>

            {message && (
                <div className="email-message email-message--success">
                    {message}
                </div>
            )}

            {error && (
                <div className="email-message email-message--error">
                    {error}
                </div>
            )}

            <div className="email-cards">
                <div className="email-card">
                    <div className="email-card__content">
                        <h2>Daily Inventory Summary</h2>
                        <p>
                            Send the current inventory summary including
                            products, categories, suppliers and low-stock
                            products.
                        </p>
                    </div>

                    <button
                        type="button" className="btn btn--primary"
                        onClick={() => handleSendEmail("daily")}
                        disabled={loading !== ""}
                    >
                        {loading === "daily"
                            ? "Sending..."
                            : "Send Report"}
                    </button>
                </div>

                <div className="email-card">
                    <div className="email-card__content">
                        <h2>Low Stock Alert</h2>
                        <p>
                            Send an alert containing products that need to be
                            restocked.
                        </p>
                    </div>

                    <button
                        type="button" className="btn btn--primary"
                        onClick={() => handleSendEmail("low-stock")}
                        disabled={loading !== ""}
                    >
                        {loading === "low-stock"
                            ? "Sending..."
                            : "Send Alert"}
                    </button>
                </div>

                <div className="email-card">
                    <div className="email-card__content">
                        <h2>Weekly Inventory Report</h2>
                        <p>
                            Send the weekly inventory report as an Excel
                            attachment.
                        </p>
                    </div>

                    <button
                        type="button" className="btn btn--primary"
                        onClick={() => handleSendEmail("weekly")}
                        disabled={loading !== ""}
                    >
                        {loading === "weekly"
                            ? "Sending..."
                            : "Send Report"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Email;