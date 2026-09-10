const express = require('express');

const {
  getItems,
  createItemWithImages,
} = require('../controllers/itemController');

const {
  protect,
  ownerOnly,
} = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// GET all items
router
  .route('/')
  .get(getItems)

  // Only owners can create items
  .post(
    protect,
    ownerOnly,
    upload.array('images', 5),
    createItemWithImages
  );

module.exports = router;