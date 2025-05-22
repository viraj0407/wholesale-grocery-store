import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import groceryrouter from "./routes/groceryroute.js";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const port = process.env.PORT || 4000; // ✅ Render uses dynamic port

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:4000","https://wholesale-grocery-store.onrender.com"], // ✅ Allow all origins or restrict to your Netlify/Render domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// API routes
app.use("/api/grocery", groceryrouter);

// Serve static frontend files
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// Serve HTML files by dynamic path
app.get("/:folder/:page", (req, res) => {
  const { folder, page } = req.params;
  const filePath = path.join(frontendPath, folder, `${page}.html`);
  res.sendFile(filePath, (err) => {
    if (err) res.status(404).send("Page not found");
  });
});

// Specific routes
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "Home/home.html"));
});

app.get("/Cart/billing.html", (req, res) => {
  res.sendFile(path.join(frontendPath, "Cart/billing.html"));
});

app.get("/Cart/order-confirmation.html", (req, res) => {
  res.sendFile(path.join(frontendPath, "Cart/order-confirmation.html"));
});

// Fallback route
app.use((req, res) => {
  res.status(404).send("404 - Not Found");
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}/`);
});
