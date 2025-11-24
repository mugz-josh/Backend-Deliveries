"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const upload_1 = __importDefault(require("../middleware/upload"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db_1 = require("../db");
const router = express_1.default.Router();
// Update profile
router.put('/profile', authMiddleware_1.verifyToken, upload_1.default.single('avatar'), async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const { name, phone } = req.body;
        let avatarPath = req.file ? `/uploads/${req.file.filename}` : undefined;
        // Build dynamic SQL
        const fields = [];
        const values = [];
        if (name) {
            fields.push('name = ?');
            values.push(name);
        }
        if (phone) {
            fields.push('phone = ?');
            values.push(phone);
        }
        if (avatarPath) {
            fields.push('avatar = ?');
            values.push(avatarPath);
        }
        if (fields.length === 0)
            return res.status(400).json({ message: 'Nothing to update' });
        const sql = `UPDATE otp_users SET ${fields.join(', ')} WHERE id = ?`;
        values.push(userId);
        await db_1.pool.query(sql, values);
        // Return updated user
        const [rows] = await db_1.pool.query('SELECT id, name, email, phone, avatar, role FROM otp_users WHERE id = ?', [userId]);
        const updatedUser = rows[0];
        res.json(updatedUser);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
// Delete avatar
router.delete('/profile/avatar', authMiddleware_1.verifyToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const [rows] = await db_1.pool.query('SELECT avatar FROM otp_users WHERE id = ?', [userId]);
        const user = rows[0];
        if (user.avatar) {
            const filePath = path_1.default.join(__dirname, '..', '..', user.avatar);
            if (fs_1.default.existsSync(filePath))
                fs_1.default.unlinkSync(filePath);
        }
        await db_1.pool.query('UPDATE otp_users SET avatar = NULL WHERE id = ?', [userId]);
        res.json({ message: 'Avatar deleted' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
