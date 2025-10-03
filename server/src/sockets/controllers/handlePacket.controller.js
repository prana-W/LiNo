import {retrievePayload, storePayload} from '../../redis/redis.js';
import {connector} from '../../constants/miscellaneous.js';

//! payload: {caption, videoUrl, timestamp}
//! key: userId${connector}video_url for Redis Functionalities
const handlePacket = (socket) => {
    return async (payload) => {
        console.log('Incoming Payload in Redis:', payload);
        try {
            const redisKey = `${socket?.userId}${connector}${payload?.data?.videoUrl}`;

            const fPayload = {
                caption: payload?.data?.caption,
                timestamp: payload?.data?.timestamp
            }

            const response = await storePayload(redisKey, fPayload);

            if (!response) {
                throw new Error(
                    'There was an error in storing the payload in Redis'
                );
            }

            socket.emit('fPacket', fPayload);
            socket.emit('confirmation', {
                success: true,
                message: 'Packet received, stored and emitted!',
            });
        } catch (error) {
            console.error('Error handling packet:', error);
        }
    };
};

export default handlePacket;
