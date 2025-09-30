import {client} from '../redis.js'


const retrievePayload = async (key) => {
    return await client.hGetAll(key);
}

async function storePayload(key, payload) {
    const oldPayload = retrievePayload(key);

    // If payload is already available, append the new subtitle to the old one
    if (oldPayload) {
        payload = {...payload, subtitle: oldPayload.subtitle + payload.subtitle};
    }

    await client.hSet(key, payload);
}

