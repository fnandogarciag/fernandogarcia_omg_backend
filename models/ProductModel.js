const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default: '',
    },
    price: {
      type: String,
      default: '0',
    },
    rate: {
      type: String,
      default: '0',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('product', ProductSchema);
