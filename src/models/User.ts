import { model, Schema } from "mongoose";

const UserSchema = new Schema({
  name: { type: String },
  cpf: { type: String },
  isActive: { type: Boolean },
  phone: { type: String },
  kids: [{ type: Schema.Types.ObjectId, ref: "Kid" }],
  gestations: [{ type: Schema.Types.ObjectId, ref: "Gestation" }],
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

// id: ID
// name: String
// cpf: String
// isActive: Boolean
// phone: String
// token: String
// email: String
// password: String
// oldPassword: String
// lastActive: Float
// createdAt: Float
// createdBy: User
// updatedBy: User
// updatedAt: Float

export const Users = model("User", UserSchema);
