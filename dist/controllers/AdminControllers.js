"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRole = exports.getAllUsers = void 0;
const db_1 = __importDefault(require("../db"));
// -------------------------
// GET ALL USERS
// -------------------------
const getAllUsers = async (req, res) => {
    try {
        const [rows] = await db_1.default.query("SELECT id, name, email, role FROM otp_users");
        res.json(rows);
    }
    catch (err) {
        console.error("❌ Error fetching users:", err);
        res.status(500).json({ message: "Server error while fetching users" });
    }
};
exports.getAllUsers = getAllUsers;
// -------------------------
// UPDATE USER ROLE
// -------------------------
const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!id || !role) {
        return res.status(400).json({ message: "User ID and role are required" });
    }
    if (!["user", "admin"].includes(role)) {
        return res.status(400).json({ message: "Role must be 'user' or 'admin'" });
    }
    try {
        const [rows] = await db_1.default.query("SELECT * FROM otp_users WHERE id=?", [id]);
        if (!rows.length)
            return res.status(404).json({ message: "User not found" });
        await db_1.default.query("UPDATE otp_users SET role=? WHERE id=?", [role, id]);
        res.json({ message: `User role updated to ${role}` });
    }
    catch (err) {
        console.error("❌ Error updating user role:", err);
        res.status(500).json({ message: "Server error while updating role" });
    }
};
exports.updateUserRole = updateUserRole;
// -------------------------
// DELETE USER
// -------------------------
const deleteUser = async (req, res) => {
    const { id } = req.params;
    if (!id)
        return res.status(400).json({ message: "User ID is required" });
    try {
        const [rows] = await db_1.default.query("SELECT * FROM otp_users WHERE id=?", [id]);
        if (!rows.length)
            return res.status(404).json({ message: "User not found" });
        await db_1.default.query("DELETE FROM otp_users WHERE id=?", [id]);
        res.json({ message: "User deleted successfully" });
    }
    catch (err) {
        console.error("❌ Error deleting user:", err);
        res.status(500).json({ message: "Server error while deleting user" });
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=AdminControllers.js.map