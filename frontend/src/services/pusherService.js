import Pusher from 'pusher-js';

const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
    cluster: import.meta.env.VITE_PUSHER_CLUSTER,
    encrypted: true
});

export const subscribeToChannel = (channelName, events) => {
    const channel = pusher.subscribe(channelName);

    // Bind all events
    Object.entries(events).forEach(([eventName, callback]) => {
        channel.bind(eventName, callback);
    });

    return () => {
        channel.unbind_all();
        pusher.unsubscribe(channelName);
    };
};

export default pusher;