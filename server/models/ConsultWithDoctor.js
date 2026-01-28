import mongoose from "mongoose";

const simpleConsultationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String },
  age: { type: Number },
  primaryConcern: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const SimpleConsultation =
  mongoose.models.SimpleConsultation ||
  mongoose.model("SimpleConsultation", simpleConsultationSchema);

export default SimpleConsultation;
