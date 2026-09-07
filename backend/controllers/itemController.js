const Item = require('../models/Item');

const getItems = async (req, res) => {
  try {
    const items = await Item.find().populate('owner', 'name email');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createItem = async (req, res) => {
  try {
    const { title, description, category, dailyRate, images } = req.body;
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
    res.status(400).json({ message: 'Invalid item data' });
  }
};

module.exports = { getItems, createItem };