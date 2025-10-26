const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const PatientUpload = require("../models/PatientUpload");

// Multer storage setup (in-memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload patient files (image or PDF)
exports.uploadPatientFiles = [
  upload.single("file"), // field name = file
  async (req, res) => {
    try {
      const { patient_id, hospital_id, diagnosis, doctor_name } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // detect if file is PDF
      const isPDF = req.file.mimetype === "application/pdf";

      // Upload to Cloudinary
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "patient_uploads",
            resource_type: isPDF ? "raw" : "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      const result = await uploadPromise;

      const record = new PatientUpload({
        patient_id,
        hospital_id,
        diagnosis,
        doctor_name,
        files: [
          {
            file_url: result.secure_url,
            file_type: isPDF ? "pdf" : "image",
            public_id: result.public_id,
          },
        ],
      });

      await record.save();

      res.status(201).json({
        message: "File uploaded successfully",
        record,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];


// ✅ Fetch all uploads for a specific patient by ID
exports.getUploadsByPatientId = async (req, res) => {
  try {
    const { patient_id } = req.params;

    if (!patient_id) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    const uploads = await PatientUpload.find({ patient_id });

    if (uploads.length === 0) {
      return res.status(404).json({ message: "No uploads found for this patient" });
    }

    res.status(200).json({
      message: `Found ${uploads.length} uploads for patient ${patient_id}`,
      uploads,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ✅ Fetch all patient uploads
exports.getPatientUploads = async (req, res) => {
  try {
    const uploads = await PatientUpload.find().populate("patient_id doctor_name");
    res.status(200).json(uploads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete upload (optional)
exports.deleteUpload = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await PatientUpload.findById(id);
    if (!record) return res.status(404).json({ message: "Record not found" });

    // Delete file from Cloudinary
    for (const file of record.files) {
      await cloudinary.uploader.destroy(file.public_id, {
        resource_type: file.file_type === "pdf" ? "raw" : "image",
      });
    }

    await record.deleteOne();

    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
