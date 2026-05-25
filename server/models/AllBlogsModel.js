import mongoose from 'mongoose'

const BlogsSchema = mongoose.Schema({
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
})

export const AllBlogs = mongoose.model('blogs_collection', BlogsSchema)
