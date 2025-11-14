import { Request, Response } from "express";
import db from "../db"; // your database connection
import nodemailer from "nodemailer";

export const sendPackage = async (req: Request, res: Response) => {
  const {
    sender,
    receiver,
    email,
    pickupAddress,
    deliveryAddress,
    weight,
    pickupLat,
    pickupLng,
  } = req.body;

  try {
    // 1️⃣ Save package info in database
    const query =
      "INSERT INTO packages (sender, receiver, email, pickupAddress, deliveryAddress, weight, pickupLat, pickupLng) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    await db.execute(query, [
      sender,
      receiver,
      email,
      pickupAddress,
      deliveryAddress,
      weight,
      pickupLat,
      pickupLng,
    ]);

    // 2️⃣ Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail", // can use another SMTP service
      auth: {
        user: process.env.EMAIL_USER, // set in .env
        pass: process.env.EMAIL_PASS, // set in .env
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Package Confirmation",
      text: `Hi ${sender}, your package to ${receiver} has been scheduled for delivery!`,
    });

    res.status(200).json({ message: "Package sent successfully! Check your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};
