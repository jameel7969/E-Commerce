const moongose = require('mongoose')

const cartItemSchema = moongose.Schema(
    {
        product: {
            type: moongose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    },
    { _id: false }
)


const cartSchema = moongose.Schema(
    {
        user: {
            type: moongose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        items: [cartItemSchema]
    },
    { timeStamps: true }
)

const Cart = moongose.model('Cart', cartSchema);

module.exports = Cart