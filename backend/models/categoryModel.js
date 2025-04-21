const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            unique: true,
            trim: true,
            minlength: [2, 'Category name must be at least 2 characters long'],
            maxlength: [50, 'Category name cannot exceed 50 characters']
        },
        description: {
            type: String,
            required: false,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters']
        },
        isActive: {
            type: Boolean,
            default: true
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Create slug before saving
categorySchema.pre('save', function (next) {
    this.slug = this.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    next();
});

// Virtual for product count (will be populated when needed)
categorySchema.virtual('productCount', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'category',
    count: true
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;