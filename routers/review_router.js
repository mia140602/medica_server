const express = require('express');
const router = express.Router();
const ReviewModel= require('../model/review_model')

router.post('/reviews', async (req, res) => {
  try {
    const { doctorId, userId, rating, review } = req.body;
    if (!doctorId || !userId) {
        return res.status(400).json("Thiếu doctorId hoặc userId");
      }
  
  const newReview = new ReviewModel({ doctorId, userId, rating, review });
  await newReview.save();
  res.status(201).json(newReview);
    
  } catch (error) {
    throw error;
  }
});
router.get('/reviews/:doctorId', async (req, res) => {
    try {
      const reviews = await ReviewModel.find({ doctorId: req.params.doctorId })
      .populate('userId','nickName')
      ;
      res.status(200).json(reviews);
    } catch (error) {
      throw error;
    }
  });

module.exports = router;