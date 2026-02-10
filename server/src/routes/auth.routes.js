const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        const alreadyExists = User.findOne({ email });
        if (alreadyExists)
            return res.json({
                success: true,
                message: "User Already registered",
            });
        await User.create({ name, email, password: hashed, tasks: [] });
        res.json({ status: true, message: "User registered" });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: true,
            message: err.message,
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res
                .status(200)
                .json({ success: false, message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res
                .status(200)
                .json({ success: false, message: "Invalid credentials" });

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.json({
            success: true,
            token,
            name: user.name,
            email: user.email,
            _id: user._id,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
});

module.exports = router;
