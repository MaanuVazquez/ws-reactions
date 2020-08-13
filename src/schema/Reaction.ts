import mongoose from 'mongoose'

export const ALLOWED_REACTIONS = ['persevere', 'relaxed', 'tired']

export default new mongoose.Schema({
  id: String,
  reaction: String,
  segmentIndex: Number,
  classId: {
    type: String,
    ref: 'Class'
  }
})
