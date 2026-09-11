const Item = require('../models/Item');

// Get all items with optional filters
const getItems = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice } = req.query;

    let query = {};

    // Search by title
    if (keyword) {
      query.title = {
        $regex: keyword,
        $options: 'i',
      };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by daily price
    if (minPrice || maxPrice) {
      query.dailyRate = {};

      if (minPrice) {
        query.dailyRate.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.dailyRate.$lte = Number(maxPrice);
      }
    }

    const items = await Item.find(query).populate('owner', 'name email');

    res.json(items);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve items',
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