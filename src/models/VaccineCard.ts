import { model, Schema } from "mongoose";

const VaccineCardSchema = new Schema({
  kid: { type: Schema.Types.ObjectId, ref: "Kid" },
  vaccine: { type: Schema.Types.ObjectId, ref: "Vaccine" },
  date: Number,
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
});

export const VaccineCards = model("VaccineCard", VaccineCardSchema);
