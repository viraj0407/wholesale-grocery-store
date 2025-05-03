import express from "express";
import multer from "multer";
import {
    addGrocery,
    allgrocerylist,
    getSingleGrocery, // Add this import
    removeGrocery,
    updateGrocery,
    signupUser,
    loginUser,
    getGroceryImage,
    getUserDetails
} from "../controllers/grocerycontroller.js";

const groceryrouter = express.Router();

// Image Upload Config (remains the same)
const storage = multer.diskStorage({
    destination: "Images",
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Add this middleware to groceryroute.js
const authenticateAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, "your_secret_key");
        // You might want to check if the user is an admin here
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

// Protect your routes like this:
groceryrouter.post("/add", upload.single("image"), addGrocery);
// groceryrouter.put("/update", updateGrocery);
// groceryrouter.post("/remove", removeGrocery);

// Grocery Routes
groceryrouter.post("/add", upload.single("image"), addGrocery);
groceryrouter.get("/list", allgrocerylist);
groceryrouter.get("/:id", getSingleGrocery); 
groceryrouter.put("/update", updateGrocery);
groceryrouter.post("/remove", removeGrocery);
groceryrouter.get("/images/:filename", getGroceryImage);

// User Routes (remain the same)
groceryrouter.post("/signup", signupUser);
groceryrouter.post("/login", loginUser);
groceryrouter.get("/user-details", getUserDetails);

export default groceryrouter;