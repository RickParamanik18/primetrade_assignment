const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, requied: true, unique: true },
    password: { type: String, required: true },
    tasks: { type: [mongoose.Schema.Types.ObjectId], default: [], ref: "Task" },
});

module.exports = mongoose.model("User", userSchema);
