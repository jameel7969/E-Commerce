const Pusher = require('pusher');

if (!process.env.PUSHER_APP_ID || !process.env.PUSHER_KEY || !process.env.PUSHER_SECRET || !process.env.PUSHER_CLUSTER) {
    throw new Error('Missing Pusher configuration. Please check your .env file.');
}

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true
});

// Define available channels and their events for documentation
const channels = {
    'products-channel': ['product-created', 'product-updated', 'product-deleted'],
    'categories-channel': ['category-created', 'category-updated', 'category-deleted']
};

module.exports = pusher;