const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth.middleware");
const User = require("../models/User");

const router = express.Router();

router.get("/", auth, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id });
        res.json({ success: true, data: tasks });
    } catch (err) {
        res.status(400).json({
            success: true,
            message: err.message,
        });
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const task = await Task.create({
            title: req.body.title,
            completed: false,
            userId: req.user._id,
        });
        await User.findByIdAndUpdate(req.user._id, {
            $push: { tasks: task._id },
        });

        res.json({ success: true, message: "Task added", data: task });
    } catch (err) {
        res.status(400).json({
            success: true,
            message: err.message,
        });
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const taskId = req.params.id;
        await Task.findByIdAndUpdate(taskId, {
            title: req.body.title,
            completed: req.body.completed,
        });
        res.json({ success: true, message: "Updated" });
    } catch (err) {
        res.status(400).json({
            success: true,
            message: err.message,
        });
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const taskId = req.params.id;
        await Task.findByIdAndDelete(taskId);
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { tasks: taskId },
        });
        res.json({ success: true, message: "Deleted" });
    } catch (err) {
        res.status(400).json({
            success: true,
            message: err.message,
        });
    }
});

module.exports = router;
