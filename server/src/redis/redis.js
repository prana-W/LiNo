import {createClient} from 'redis';

const client = createClient({
    url: process.env.REDIS_URL,
});

// key: username:video_url
const retrievePayload = async (key) => {
    return await client.lRange(key, 0, -1);
}

const storePayload = async (key, payload) => {

    const data = {
        subtitle: payload.subtitle,
        timestamp: payload.timestamp,
    }

    await client.rPush(key, JSON.stringify(data));


}

export {retrievePayload, storePayload, client};
