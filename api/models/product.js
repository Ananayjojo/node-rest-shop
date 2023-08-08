// productSchema.js
const mongoose = require('mongoose');
const locationSchema = require('./locationSchema'); // Update the path accordingly

const productSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  origin: locationSchema,
  destination: locationSchema,
});

module.exports = mongoose.model('Product', productSchema);
