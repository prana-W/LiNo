import {client} from '../redis/redis.js'

async function connectToRedis() {
    try {
        await client.connect();
    } catch (error) {
        console.error('Redis Client Error', error);
        process.exit(1);
    }
}

export default connectToRedis;
