import express from 'express';
import { verifyToken, AuthRequest } from '../middleware/authMiddleware';
import upload from '../middleware/upload';
import fs from 'fs';
import path from 'path';
import pool from '../db';


const router = express.Router();

// Update profile
router.put('/profile', verifyToken, upload.single('avatar'), async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { name, phone } = req.body;
    let avatarPath = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Build dynamic SQL
    const fields: string[] = [];
    const values: any[] = [];

    if (name) { fields.push('name = ?'); values.push(name); }
    if (phone) { fields.push('phone = ?'); values.push(phone); }
    if (avatarPath) { fields.push('avatar = ?'); values.push(avatarPath); }

    if (fields.length === 0) return res.status(400).json({ message: 'Nothing to update' });

    const sql = `UPDATE otp_users SET ${fields.join(', ')} WHERE id = ?`;
    values.push(userId);

    await pool.query(sql, values);

    // Return updated user
    const [rows] = await pool.query('SELECT id, name, email, phone, avatar, role FROM otp_users WHERE id = ?', [userId]);
    const updatedUser = (rows as any)[0];
    res.json(updatedUser);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete avatar
router.delete('/profile/avatar', verifyToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const [rows] = await pool.query('SELECT avatar FROM otp_users WHERE id = ?', [userId]);
    const user = (rows as any)[0];

    if (user.avatar) {
      const filePath = path.join(__dirname, '..', '..', user.avatar);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await pool.query('UPDATE otp_users SET avatar = NULL WHERE id = ?', [userId]);
    res.json({ message: 'Avatar deleted' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
