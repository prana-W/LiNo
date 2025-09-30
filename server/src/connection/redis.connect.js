import {client} from '../redis/redis.js'

async function connectToRedis() {
    try {
        await client.connect();
    } catch (error) {

        console.error('Error in connecting to Redis:', error);
        process.exit(1);
    }
}

export default connectToRedis;
