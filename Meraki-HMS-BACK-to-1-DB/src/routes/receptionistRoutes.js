const express = require("express");
const router = express.Router();
const { registerReceptionist, loginReceptionist , resetPassword } = require("../controllers/receptionistController");

// Register
router.post("/register", registerReceptionist);

// Login
router.post("/login", loginReceptionist);

//reset password route 
router.post("/reset-password", resetPassword);

module.exports = router;
