const express = require("express");
const router = express.Router();
const {
  uploadPatientFiles,
  getPatientUploads,
  deleteUpload,
  getUploadsByPatientId
} = require("../controllers/patientUploadController");
const {isLoggedIn} = require("../middleware/authMiddleware");

router.post("/upload", isLoggedIn , uploadPatientFiles);
router.get("/", isLoggedIn , getPatientUploads);
router.get("/:patient_id", isLoggedIn , getUploadsByPatientId); 
router.delete("/:id", isLoggedIn , deleteUpload);


module.exports = router;
