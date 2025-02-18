const asyncHandler = require('express-async-handler');
const Store = require('../models/Store');

// @desc    Return all stores
// @route   GET /api/stores/
// @access  Private
const getStores = asyncHandler(async (req, res) => {  
    const stores = await Store.find();
    if (stores.length === 0) {
      return res.status(404).json({ message: 'No stores created yet' });
    }
  
    res.status(200).json({ data: stores });
});

// @desc    Add new store
// @route   POST /api/stores/
// @access  Private
const addNewStore = asyncHandler(async (req, res) => {  
  const { name, location} = req.body;

  if (!name || !location) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const newStore = await Store.create({
    name,
    location
  })

  if (!newStore) {
    return res.status(500).json({ message: 'Store creation failed' });
  }

  res.status(201).json({ message: 'Store created successfully', store: newStore });
});

// @desc    Delete store by id
// @route   DELETE /api/stores/:storeId
// @access  Private
const deleteStore = asyncHandler(async (req, res) => {  
  const { storeId } = req.params

  if (!storeId) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const store = await Store.findByIdAndDelete(storeId)

  if (!store) {
    return res.status(500).json({ message: 'Store deletion failed' });
  }

  res.status(200).json({ message: 'Store deleted successfully' });
});

module.exports = {
    getStores,
    addNewStore,
    deleteStore
};