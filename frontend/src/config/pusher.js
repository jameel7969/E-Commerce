import Pusher from 'pusher-js';

const pusher = new Pusher('5056ab1904657b6e7cbc', {
    cluster: 'us3',
    encrypted: true
});

export default pusher;