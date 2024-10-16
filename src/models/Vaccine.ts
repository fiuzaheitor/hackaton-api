import { model, Schema } from "mongoose";

const VaccineSchema = new Schema({
  name: { type: String },
  description: { type: String },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
});

export const Vaccines = model("Vaccine", VaccineSchema);
