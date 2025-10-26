// src/routes/adminRoutes.js
const express = require("express");
const router = express.Router();

const { registerAdmin, loginAdmin, resetAdminPassword} = require("../controllers/adminController");

// Public endpoints for now; protect routes later with isLoggedIn middleware if needed.
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/reset-password", resetAdminPassword); // 🔁 Reset admin password route

module.exports = router;
