import express from "express";
import { sendPackage } from "../controllers/SendPackageControllers";

const router = express.Router();

// POST endpoint for sending package
router.post("/", sendPackage);

export default router;
