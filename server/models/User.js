import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
)

// What the API sends back about a user (never the password hash)
userSchema.methods.toPublic = function () {
  return { id: this._id, name: this.name, email: this.email }
}

export const User = mongoose.model('User', userSchema, 'users')
