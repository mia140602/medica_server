const express = require('express');
const router = express.Router();
const NotificationModel = require('../model/notification_model');

// Tạo thông báo
router.post('/', async (req, res) => {
    const notification = new NotificationModel({
        userId: req.body.userId,
        message: req.body.message
    });
    await notification.save();
    res.json(notification);
});

// Lấy thông báo của một người dùng
router.get('/:userId', async (req, res) => {
    const notifications = await NotificationModel.find({ userId: req.params.userId }).sort('-date');
    res.json(notifications);
});

module.exports = router;