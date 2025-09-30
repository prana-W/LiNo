import {createClient} from 'redis';

const client = createClient({
    url: process.env.REDIS_URL,
});

//! key: username:videoUrl
const retrievePayload = async (key) => {
    return await client.lRange(key, 0, -1);
}

const storePayload = async (key, payload) => {

    const data = {
        caption: payload.caption,
        timestamp: payload.timestamp,
    }

    return await client.rPush(key, JSON.stringify(data));


}

export {retrievePayload, storePayload, client};
