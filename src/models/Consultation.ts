import { model, Schema } from 'mongoose';

const ConsultationSchema = new Schema({
  gestation: { type: Schema.Types.ObjectId, ref: 'Gestation' },
  date: { type: Number, default: Date.now },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

export const Consultations = model('Consultation', ConsultationSchema);