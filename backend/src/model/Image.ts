import mongoose, { Schema } from 'mongoose';

const ImageSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  title: { type: String }
}, { timestamps: true });

export default mongoose.model('Image', ImageSchema);
