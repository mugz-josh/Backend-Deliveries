"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SendPackageControllers_1 = require("../controllers/SendPackageControllers");
const router = express_1.default.Router();
// POST endpoint for sending package
router.post("/", SendPackageControllers_1.sendPackage);
exports.default = router;
