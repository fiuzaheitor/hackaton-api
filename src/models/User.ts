import { model, Schema } from "mongoose";

const UserSchema = new Schema({
  name: { type: String },
  cpf: { type: String },
  isActive: { type: Boolean, default: true },
  phone: { type: String },
  token: { type: String },
  email: { type: String },
  password: { type: String },
  oldPassword: { type: String },
  lastActive: { type: Number },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
});

export const Users = model("User", UserSchema);
