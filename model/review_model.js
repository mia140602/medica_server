const mongoose =require('mongoose');
const db= require("../config/db");
const { Schema } = mongoose;
const ReviewSchema = new Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctors' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  rating: { type: Number, required: true },
  review: { type: String },
}, { timestamps: true });

const ReviewModel= db.model('reviews',ReviewSchema);
module.exports=ReviewModel;