// models/Product.js
const mongoose = require('mongoose'); 

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0 , 'Product price cannot be less than 0']
    },
    imageLinks: [{ // Changed from 'imagesLink' to 'imageLinks'
        type: String,
        // Optional: Add URL validation if desired
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
