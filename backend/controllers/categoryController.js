const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const pusher = require('../config/pusher');

const getCategories = async (req, res) => {
    try {
        const categories = await Category
            .find({})
            .populate('productCount');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, description, isActive } = req.body;

        const categoryExists = await Category.findOne({
            $or: [
                { name },
                { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
            ]
        });

        if (categoryExists) {
            return res.status(400).json({ message: 'Category with this name already exists' });
        }

        const category = await Category.create({
            name,
            description,
            isActive: isActive !== undefined ? isActive : true,
        });

        // Populate the virtual field before sending response
        const populatedCategory = await Category.findById(category._id).populate('productCount');

        try {
            await pusher.trigger('categories-channel', 'category-created', populatedCategory);
        } catch (pusherError) {
            console.error('Pusher error:', pusherError);
        }

        res.status(201).json(populatedCategory);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation Error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { name, description, isActive } = req.body;
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if new name conflicts with existing categories (excluding current category)
        if (name && name !== category.name) {
            const nameExists = await Category.findOne({
                _id: { $ne: category._id },
                $or: [
                    { name },
                    { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
                ]
            });

            if (nameExists) {
                return res.status(400).json({ message: 'Category with this name already exists' });
            }
        }

        category.name = name || category.name;
        category.description = description !== undefined ? description : category.description;
        category.isActive = isActive !== undefined ? isActive : category.isActive;

        await category.save();

        // Populate the virtual field before sending response
        const updatedCategory = await Category.findById(category._id).populate('productCount');

        try {
            await pusher.trigger('categories-channel', 'category-updated', updatedCategory);
        } catch (pusherError) {
            console.error('Pusher error:', pusherError);
        }

        res.json(updatedCategory);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation Error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if there are any products using this category
        const productsCount = await Product.countDocuments({ category: req.params.id });

        if (productsCount > 0) {
            return res.status(400).json({
                message: 'Cannot delete category: There are products associated with this category. Please reassign or delete the products first.'
            });
        }

        await category.deleteOne();

        try {
            await pusher.trigger('categories-channel', 'category-deleted', { _id: req.params.id });
        } catch (pusherError) {
            console.error('Pusher error:', pusherError);
        }

        res.json({ message: 'Category removed', _id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getCategoryBySlug = async (req, res) => {
    try {
        const category = await Category
            .findOne({ slug: req.params.slug })
            .populate('productCount');

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryBySlug
};