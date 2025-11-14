import { Router } from "express";
import db from "../db";
import nodemailer from "nodemailer";

const router = Router();

// -----------------------------
// DASHBOARD STATS
// -----------------------------
router.get("/dashboard/stats", async (req, res) => {
  try {
    const [pendingRows] = await db.query(
      "SELECT COUNT(*) as count FROM deliveries WHERE status = 'pending'"
    );
    const [inTransitRows] = await db.query(
      "SELECT COUNT(*) as count FROM deliveries WHERE status = 'in_transit'"
    );
    const [deliveredRows] = await db.query(
      "SELECT COUNT(*) as count FROM deliveries WHERE status = 'delivered'"
    );
    const [totalRows] = await db.query("SELECT COUNT(*) as count FROM deliveries");

    const total = (totalRows as any)[0].count;
    const delivered = (deliveredRows as any)[0].count;
    const successRate = total > 0 ? Math.round((delivered / total) * 100) : 0;

    const stats = {
      pending: (pendingRows as any)[0].count,
      inTransit: (inTransitRows as any)[0].count,
      delivered: (deliveredRows as any)[0].count,
      total: total,
      successRate: successRate,
      averageDeliveryTime: 2.5, // default/fixed
    };

    res.json(stats);
  } catch (err) {
    console.error("Failed to fetch dashboard stats:", err);
    res.status(500).json({ error: "Failed to fetch dashboard statistics" });
  }
});

// -----------------------------
// CREATE NEW DELIVERY (with email)
// -----------------------------
router.post("/", async (req, res) => {
  try {
    const {
      senderName,
      senderPhone,
      senderAddress,
      receiverName,
      receiverPhone,
      receiverAddress,
      packageType,
      packageWeight,
      packageDescription,
      pickupDate,
      deliveryType,
      status = "pending",
    } = req.body;

    // Validate required fields
    if (
      !senderName ||
      !senderPhone ||
      !senderAddress ||
      !receiverName ||
      !receiverPhone ||
      !receiverAddress ||
      !pickupDate
    ) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    // Insert new delivery
    const [result] = await db.query(
      `INSERT INTO deliveries 
      (senderName, senderPhone, senderAddress, receiverName, receiverPhone, receiverAddress, packageType, packageWeight, packageDescription, pickupDate, deliveryType, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        senderName,
        senderPhone,
        senderAddress,
        receiverName,
        receiverPhone,
        receiverAddress,
        packageType,
        packageWeight,
        packageDescription,
        pickupDate,
        deliveryType,
        status,
      ]
    );

    const [newDeliveryRows] = await db.query(
      "SELECT * FROM deliveries WHERE id = ?",
      [(result as any).insertId]
    );
    const newDelivery = (newDeliveryRows as any)[0];

    // Send email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // receive all orders here
      subject: `New Delivery Order from ${senderName}`,
      text: `
Sender Information:
  Name: ${senderName}
  Phone: ${senderPhone}
  Address: ${senderAddress}

Receiver Information:
  Name: ${receiverName}
  Phone: ${receiverPhone}
  Address: ${receiverAddress}

Package Details:
  Type: ${packageType}
  Weight: ${packageWeight}kg
  Description: ${packageDescription}
  Pickup Date: ${pickupDate}
  Delivery Type: ${deliveryType}
  Status: ${status}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "Delivery created successfully and email sent!",
      delivery: newDelivery,
    });
  } catch (err) {
    console.error("Failed to create delivery:", err);
    res.status(500).json({ error: "Failed to create delivery" });
  }
});

// -----------------------------
// GET ALL DELIVERIES (search/filter/pagination)
// -----------------------------
router.get("/", async (req, res) => {
  try {
    const { status, search, page = 1, limit = 5 } = req.query;

    let query = "SELECT * FROM deliveries WHERE 1=1";
    const params: any[] = [];

    if (status && status !== "all") {
      query += " AND status = ?";
      params.push(status);
    }

    if (search) {
      query += " AND (senderName LIKE ? OR receiverName LIKE ? OR packageDescription LIKE ?)";
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit as string), offset);

    const [rows] = await db.query(query, params);

    // Total count for pagination
    let countQuery = "SELECT COUNT(*) as total FROM deliveries WHERE 1=1";
    const countParams: any[] = [];

    if (status && status !== "all") {
      countQuery += " AND status = ?";
      countParams.push(status);
    }
    if (search) {
      countQuery += " AND (senderName LIKE ? OR receiverName LIKE ? OR packageDescription LIKE ?)";
      const term = `%${search}%`;
      countParams.push(term, term, term);
    }

    const [countRows] = await db.query(countQuery, countParams);
    const total = (countRows as any)[0].total;
    const totalPages = Math.ceil(total / parseInt(limit as string));

    res.json({
      deliveries: rows,
      total: total,
      page: parseInt(page as string),
      totalPages: totalPages,
    });
  } catch (err) {
    console.error("Failed to fetch deliveries:", err);
    res.status(500).json({ error: "Failed to fetch deliveries" });
  }
});

// -----------------------------
// UPDATE DELIVERY STATUS
// -----------------------------
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE deliveries SET status = ? WHERE id = ?",
      [status, id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    const [updatedRows] = await db.query("SELECT * FROM deliveries WHERE id = ?", [id]);
    const updatedDelivery = (updatedRows as any)[0];

    res.json({ message: "Status updated successfully", delivery: updatedDelivery });
  } catch (err) {
    console.error("Failed to update delivery status:", err);
    res.status(500).json({ error: "Failed to update delivery status" });
  }
});

// -----------------------------
// PATCH (legacy status update)
// -----------------------------
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const [result] = await db.query("UPDATE deliveries SET status = ? WHERE id = ?", [status, id]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    res.json({ id, status });
  } catch (err) {
    console.error("Failed to update delivery status:", err);
    res.status(500).json({ error: "Failed to update delivery status" });
  }
});

// -----------------------------
// DELETE DELIVERY
// -----------------------------
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM deliveries WHERE id = ?", [id]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    res.json({ message: "Delivery deleted" });
  } catch (err) {
    console.error("Failed to delete delivery:", err);
    res.status(500).json({ error: "Failed to delete delivery" });
  }
});

export default router;
