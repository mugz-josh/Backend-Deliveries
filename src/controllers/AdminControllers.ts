// src/controllers/AdminControllers.ts
import { Request, Response } from "express";
import db from "../db";

// -------------------------
// GET ALL USERS
// -------------------------
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.query("SELECT id, name, email, role FROM otp_users");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

// -------------------------
// UPDATE USER ROLE
// -------------------------
export const updateUserRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!id || !role) {
    return res.status(400).json({ message: "User ID and role are required" });
  }

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ message: "Role must be 'user' or 'admin'" });
  }

  try {
    const [rows]: any = await db.query("SELECT * FROM otp_users WHERE id=?", [id]);
    if (!rows.length) return res.status(404).json({ message: "User not found" });

    await db.query("UPDATE otp_users SET role=? WHERE id=?", [role, id]);
    res.json({ message: `User role updated to ${role}` });
  } catch (err) {
    console.error("❌ Error updating user role:", err);
    res.status(500).json({ message: "Server error while updating role" });
  }
};

// -------------------------
// DELETE USER
// -------------------------
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "User ID is required" });

  try {
    const [rows]: any = await db.query("SELECT * FROM otp_users WHERE id=?", [id]);
    if (!rows.length) return res.status(404).json({ message: "User not found" });

    await db.query("DELETE FROM otp_users WHERE id=?", [id]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ message: "Server error while deleting user" });
  }
};
