const Product = require('../models/productModel');
const pusher = require('../config/pusher');

const getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        const query = category ? { category } : {};

        const products = await Product.find(query).populate('category', 'name');
        if (!products) {
            return res.status(404).json({ message: 'No products found' });
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

const createProduct = async (req, res) => {
    try {
        const { name, description, imageUrl, price, category } = req.body;

        if (!name || !description || !imageUrl || !price || !category) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const product = new Product({
            name,
            description,
            imageUrl,
            price,
            category,
        });

        const createdProduct = await product.save();
        const populatedProduct = await Product.findById(createdProduct._id).populate('category', 'name');

        try {
            await pusher.trigger('products-channel', 'product-created', populatedProduct);
        } catch (pusherError) {
            console.error('Pusher error:', pusherError);
        }

        res.status(201).json(populatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

const updateProduct = async (req, res) => {
    try {
        const { name, description, imageUrl, price, category } = req.body;
        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = name;
            product.description = description;
            product.imageUrl = imageUrl;
            product.price = price;
            product.category = category;

            const updatedProduct = await product.save();
            const populatedProduct = await Product.findById(updatedProduct._id).populate('category', 'name');

            try {
                await pusher.trigger('products-channel', 'product-updated', populatedProduct);
            } catch (pusherError) {
                console.error('Pusher error:', pusherError);
            }
            res.json(populatedProduct);
        } else {
            res.status(404).json({ message: "Cannot find the product" });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            try {
                await pusher.trigger('products-channel', 'product-deleted', { _id: req.params.id });
            } catch (pusherError) {
                console.error('Pusher error:', pusherError);
            }
            res.status(200).json({ message: "Product deleted" });
        } else {
            res.status(404).json({ message: "Cannot find the product" });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

const deleteAllProducts = async (req, res) => {
    try {
        const result = await Product.deleteMany({});
        res.status(200).json({ message: "Products deleted successfully", deleteCount: result.deletedCount })
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteAllProducts,
};