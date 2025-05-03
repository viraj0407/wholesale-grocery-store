import grocerymodel from "../models/grocery-store-model.js";
import User from "../models/userModel.js";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Add Grocery
const addGrocery = async (req, res) => {
    let image_filename = req.file ? req.file.filename : "default.jpg";

    const grocery = new grocerymodel({
        name: req.body.name,
        description: req.body.description,
        wholesale_Price: req.body.wholesale_Price,
        retail_Price: req.body.retail_Price,
        image: image_filename,
        category: req.body.category
    });

    try {
        await grocery.save();
        res.json({ success: true, message: "Grocery added successfully" });
    } catch (error) {
        res.json({ success: false, message: "Error adding grocery", error });
    }
};

// Get all grocery items
const allgrocerylist = async (req, res) => {
    try {
        const grocery = await grocerymodel.find({});
        res.json({ success: true, data: grocery });
    } catch (error) {
        res.json({ success: false, message: "Error retrieving groceries", error });
    }
};

// Remove Grocery
const removeGrocery = async (req, res) => {
    try {
        const grocery = await grocerymodel.findById(req.body.id);
        if (!grocery) return res.status(404).json({ success: false, message: "Grocery not found" });

        const imagePath = `Images/${grocery.image}`;
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

        await grocerymodel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Grocery removed successfully" });
    } catch (error) {
        res.json({ success: false, message: "Error: Grocery not removed", error });
    }
};

// Update Grocery
const updateGrocery = async (req, res) => {
    try {
        const { id, name, description, wholesale_Price, retail_Price, category } = req.body;
        const grocery = await grocerymodel.findById(id);

        if (!grocery) return res.status(404).json({ success: false, message: "Grocery not found" });

        grocery.name = name || grocery.name;
        grocery.description = description || grocery.description;
        grocery.wholesale_Price = wholesale_Price || grocery.wholesale_Price;
        grocery.retail_Price = retail_Price || grocery.retail_Price;
        grocery.category = category || grocery.category;

        await grocery.save();
        res.json({ success: true, message: "Grocery updated successfully", data: grocery });
    } catch (error) {
        res.json({ success: false, message: "Error updating grocery", error });
    }
};

// User Signup
const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ success: false, message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });

        await newUser.save();
        res.json({ success: true, message: "User registered successfully" });
    } catch (error) {
        res.json({ success: false, message: "Error registering user", error });
    }
};

// User Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, "your_secret_key", { expiresIn: "1h" });
        res.json({ success: true, message: "Login successful", token });
    } catch (error) {
        res.json({ success: false, message: "Error logging in", error });
    }
};

// Serve Images
const getGroceryImage = (req, res) => {
    const imagePath = path.join("Images", req.params.filename);
    if (fs.existsSync(imagePath)) {
        res.sendFile(path.resolve(imagePath));
    } else {
        res.status(404).json({ success: false, message: "Image not found" });
    }
};

// export { addGrocery, allgrocerylist, removeGrocery, updateGrocery, signupUser, loginUser, getGroceryImage };


export const getUserDetails = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, "your_secret_key");
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, email: user.email });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching user details" });
    }
};


// Get single grocery item
export const getSingleGrocery = async (req, res) => {
    try {
        const grocery = await grocerymodel.findById(req.params.id);
        if (!grocery) {
            return res.status(404).json({ success: false, message: "Grocery item not found" });
        }
        res.json({ success: true, data: grocery });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching grocery item", error });
    }
};

// Update the exports at the bottom to include the new function
export { 
    addGrocery, 
    allgrocerylist, 
    removeGrocery, 
    updateGrocery, 
    signupUser, 
    loginUser, 
    getGroceryImage,
};