import {createClient} from 'redis';
import {Lecture} from '../models/index.js';
import {connector} from '../constants/miscellaneous.js';

const client = createClient({
    url: process.env.REDIS_URL,
});

//! key: userId${connector}videoUrl
const retrievePayload = async (key, start = 0, end = -1) => {
    return await client.lRange(key, start, end);
};

const storePayload = async (key, payload) => {
    return await client.rPush(key, JSON.stringify(payload?.data));
};

const addMetaData = async (key, metaData) => {
    return await client.json.set(key, '$', metaData);
};

const getMetaData = async (key) => {
    return await client.json.get(key, {path: '$'});
};

// Todo: Run this after is >= 30 entries in the Redis DB List
const flushData = async (key) => {
    try {
        const userId = key.split(connector)[0];
        const videoUrl = key.split(connector)[1];

        // Find a lecture document which has both same user and videoUrl
        const existing = await Lecture.findOne({
            $and: [{user: userId}, {videoUrl: videoUrl}],
        });

        // Create a new Lecture Document
        // Todo: How to add the meta-data about the lecture
        if (!existing) {
            const metaData = await getMetaData(key);

            const data = {
                name: metaData?.name || 'New Lecture',
                videoUrl: videoUrl,
                user: userId,
                description: metaData?.description || '',
                content: 'Join the existing content!!', // Todo: add the content by adding all the contents in the redis DB
            };
            const res = await Lecture.create(data);

            if (!res) {
                throw new Error(
                    'There was an error in creating the lecture document'
                );
                //Todo: handle this error
            }

            //Todo: Delete the data stored in the redis (the first 30 data in the List)
        }
    } catch (err) {
        console.error(err);
    }
};

export {
    retrievePayload,
    storePayload,
    client,
    addMetaData,
    getMetaData,
    flushData,
};
