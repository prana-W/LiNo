import {retrievePayload, storePayload} from '../../redis/redis.js';
import {connector} from '../../constants/miscellaneous.js';

//! payload: {caption, videoUrl, timestamp}
//! key: userId:video_url for Redis Functionalities
const handlePacket = (socket) => {
    return async (payload) => {
        try {
            const redisKey = `${socket?.userId}${connector}${payload?.videoUrl}`;
            const response = await storePayload(redisKey, payload);
            const existingData = await retrievePayload(redisKey);

            console.log(existingData);

            if (!response) {
                throw new Error(
                    'There was an error in storing the payload in Redis'
                );
            }

            socket.emit('fPacket', payload);
            socket.emit('confirmation', {
                success: true,
                message: 'Packet received, stored and emitted!',
            });
        } catch (error) {
            //Todo: handle error
        }
    };
};

export default handlePacket;
