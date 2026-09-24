import app from "./app.js";
import { connectDB } from "./config/db.js";
    import "dotenv/config";
import { startCron } from "./cron/emailCron.js";

const PORT = process.env.PORT || 1213;
async function startServer() {
    await connectDB();
}
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    startCron();
});
startServer();
