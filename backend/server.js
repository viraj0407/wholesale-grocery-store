import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import groceryrouter from "./routes/groceryroute.js";

import path from "path";
import { fileURLToPath } from "url";


// Fix __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors());

// In server.js
app.use(cors({
    origin: 'http://localhost:4000', // Or your admin panel URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

// Connect to MongoDB
connectDB();

// API Endpoints
app.use("/api/grocery", groceryrouter);

// Serve Static Files from Frontend
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// Auto Serve Any HTML File
app.get("/:folder/:page", (req, res) => {
    const { folder, page } = req.params;
    const filePath = path.join(frontendPath, folder, `${page}.html`);
    res.sendFile(filePath, (err) => {
        if (err) res.status(404).send("Page not found");
    });
});

// Default Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "Home/home.html"));
});

app.get("/Cart/billing.html", (req, res) => {
    res.sendFile(path.join(frontendPath, "Cart/billing.html"));
});

app.get("/Cart/order-confirmation.html", (req, res) => {
    res.sendFile(path.join(frontendPath, "Cart/order-confirmation.html"));
});

// Start Server
app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}/Home/home.html`);
});
