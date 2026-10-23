import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    imageUrl: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true, maxlength: 600 },
    benefits: { type: String, trim: true, maxlength: 600, default: '' },
    howToPrepare: { type: String, required: true, trim: true, maxlength: 5000 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

export const Post = mongoose.model('Post', postSchema, 'review_blogs')
