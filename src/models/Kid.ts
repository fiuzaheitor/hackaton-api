import { model, Schema } from "mongoose";

const KidSchema = new Schema({
  name: { type: String},
  vaccineCard: { type: Schema.Types.ObjectId, ref: "VaccineCard" },
  birthDate: { type: Number },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
});

export const Kids = model("Kid", KidSchema);
