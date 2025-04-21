const Product = require('../models/productModel');
const Cart = require('../models/cartModel');


const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body

        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: req.user._id })
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] })
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() == productId)

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity
        } else {
            cart.items.push({ product: productId, quantity })
        }

        const updatedCart = await cart.save()
        res.status(201).json(updatedCart);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}


const removeCartItem = async (req, res) => {
    try {
        const { productId } = req.params;

        let cart = await Cart.findOne({ user: req.user._id })
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId)
        const updatedCart = await cart.save();
        res.json(updatedCart);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}


const getCartItems = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product')

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }
        res.json(cart);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

const updateCart = async (req, res) => {
    try {
        const { quantity } = req.body;
        const { productId } = req.params;

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Product not in cart' });
        }

        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        const updatedCart = await cart.save();
        res.json(updatedCart);


    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}