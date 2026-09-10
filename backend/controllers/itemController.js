const Item = require('../models/Item');

// Get all items
const getItems = async (req, res) => {
  try {
    const items = await Item.find().populate('owner', 'name email');

    res.json(items);
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
    });
  }
};

// Create item without image upload
const createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      dailyRate,
      images,
    } = req.body;

    const item = new Item({
      owner: req.user._id,
      title,
      description,
      category,
      dailyRate,
      images: images || [],
    });

    const createdItem = await item.save();

    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({
      message: 'Invalid item data',
    });
  }
};

// Create item with images uploaded to AWS S3
const createItemWithImages = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      dailyRate,
    } = req.body;

    // Get image URLs from AWS S3
    const imageUrls = req.files
      ? req.files.map((file) => file.location)
      : [];

    const item = new Item({
      owner: req.user._id,
      title,
      description,
      category,
      dailyRate,
      images: imageUrls,
    });

    const createdItem = await item.save();

    res.status(201).json(createdItem);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: 'Error processing item creation',
    });
  }
};

module.exports = {
  getItems,
  createItem,
  createItemWithImages,
};