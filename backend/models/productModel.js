const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Add a pre-remove middleware to prevent deletion if category doesn't exist
productSchema.pre('save', async function (next) {
    if (this.category) {
        const Category = mongoose.model('Category');
        const category = await Category.findById(this.category);
        if (!category) {
            throw new Error('Selected category does not exist');
        }
    }
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;