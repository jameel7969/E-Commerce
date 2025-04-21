const moongoose = require('mongoose');

const userSchema = new moongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false
        },
        roles: [{
            type: moongoose.Schema.Types.ObjectId,
            ref: 'Role'
        }]
    },
    { timestamps: true }
);

const User = moongoose.model('User', userSchema);

module.exports = User;