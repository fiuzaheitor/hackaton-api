import { model, Schema } from "mongoose";

const VaccineSchema = new Schema({
  vaccineCard: { type: Schema.Types.ObjectId, ref: "VaccineCard" },
  vaccineTemplate: { type: Schema.Types.ObjectId, ref: "VaccineTemplate" },
  name: { type: String },
  description: { type: String },
  applicationDate: { type: Number },
  isFinished: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
});

const VaccineTemplateSchema = new Schema({
  name: { type: String },
  description: { type: String },
  applicationDate: { type: Number },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
});

export const Vaccines = model("Vaccine", VaccineSchema);
export const VaccineTemplates = model("VaccineTemplate", VaccineTemplateSchema);
