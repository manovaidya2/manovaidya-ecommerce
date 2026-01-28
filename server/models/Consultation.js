import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String },
  age: { type: Number },
  primaryConcern: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Consultation = mongoose.models.Consultation || mongoose.model("Consultation", consultationSchema);

export default Consultation;
