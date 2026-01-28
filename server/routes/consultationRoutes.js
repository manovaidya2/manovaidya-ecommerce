import express from "express";
import SimpleConsultation from "../models/SimpleConsultation.js";

const router = express.Router();

router.post("/book", async (req, res) => {
  try {
    const consultation = new SimpleConsultation(req.body);
    await consultation.save();

    res.status(201).json({
      success: true,
      data: consultation,
    });
  } catch (error) {
    console.error("SAVE ERROR:", error.message);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    const consultations = await SimpleConsultation.find().sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: consultations });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    await SimpleConsultation.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Consultation deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
export default router;
