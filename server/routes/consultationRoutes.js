import express from "express";
import Consultation from "../models/Consultation.js";

const router = express.Router();

// POST: Book consultation
router.post("/book", async (req, res) => {
  try {
    const consultation = new Consultation(req.body);
    await consultation.save();
    res.status(201).json({ success: true, data: consultation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET: Fetch all consultations (admin)
router.get("/all", async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: consultations });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
