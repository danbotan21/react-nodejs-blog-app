import mongoose from 'mongoose'

const BlogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  imageUrl: {
    type: String,
    require: true,
  },
  created: {
    type: Date,
    require: true,
    default: Date.now(),
  },
  writtenBy: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  benefits: {
    type: String,
    require: true,
  },

  howToPrepare: {
    type: String,
    require: true,
  },
})

export const BlogReview = mongoose.model('review_blogs', BlogSchema)
