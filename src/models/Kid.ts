import { model, Schema } from "mongoose";

const KidSchema = new Schema({
  mom: { type: Schema.Types.ObjectId, ref: "User" },
  name: { type: String },
  birthDate: { type: Number },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
});

export const Kids = model("Kid", KidSchema);
