"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const router = (0, express_1.Router)();
// SIGNUP
router.post("/signup", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const existing = await user_1.User.findOne({ email });
        if (existing)
            return res.status(400).json({ message: "User already exists" });
        const hashed = await bcrypt_1.default.hash(password, 10);
        const user = await user_1.User.create({ email, passwordHash: hashed, name });
        res.json({ message: "User created", user: { id: user._id, email: user.email } });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});
// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_1.User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "User not found" });
        const valid = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!valid)
            return res.status(400).json({ message: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ token, user: { id: user._id, email: user.email } });
    }
    catch (err) {
        console.log('error', err);
        res.status(500).json({ error: err });
    }
});
// PROFILE (Protected Example)
router.get("/me", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ message: "No token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await user_1.User.findById(decoded.id).select("-passwordHash");
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});
exports.default = router;
