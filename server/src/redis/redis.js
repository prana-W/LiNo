import {createClient} from 'redis';
import {Lecture} from '../models/index.js';
import {connector, REDIS_DB_LIST_LIMIT} from '../constants/miscellaneous.js';
import asyncHandler from './utility/asyncHandler.redis.js';

const client = createClient({
    url: process.env.REDIS_URL,
});

client.on('error', () => {
    console.error('Redis Client Error');
});

//! key: userId${connector}videoUrl

const storePayloadToRedis = asyncHandler(async (key, payload) => {
    const currListSize = await client.rPush(key, JSON.stringify(payload));

    if (currListSize > REDIS_DB_LIST_LIMIT) {
        await flushData(key);
    }

    return currListSize;
});

const addMetaData = asyncHandler(async (key, metaData) => {
    return await client.json.set(`${key}${connector}metadata`, '$', metaData);
});

const getMetaData = asyncHandler(async (key) => {
    return await client.json.get(`${key}${connector}metadata`, {path: '$'});
});

const lumpCaption = asyncHandler(async (key) => {
    let str = '';

    for (let i = 0; i < REDIS_DB_LIST_LIMIT; i++) {
        const data = JSON.parse(await client.lPop(key));

        if (!data || !data?.caption) break;

        str += data?.caption;
    }

    return str;

});

// Todo: Fix deletion of collection key as well from Redis and then recreation of it again from scratch
const flushData = asyncHandler(async (key) => {

    const content = await lumpCaption(key);

    const userId = key.split(connector)[0];
    const videoUrl = key.split(connector)[1];

    const lecture = await Lecture.findOne({
        $and: [{user: userId}, {videoUrl: videoUrl}],
    });

    // Todo: How to add the meta-data about the lecture

    if (!lecture) {
        const metaData = await getMetaData(key);

        const data = {
            name: metaData?.name || 'New Lecture',
            videoUrl: videoUrl,
            user: userId,
            description: metaData?.description || '',
            content: content || '',
        };

        const res = await Lecture.create(data);

        if (!res) {
            throw new Error(
                'There was an error in creating the lecture document'
            );
            //Todo: handle this error
        }
    } else {
        lecture.content = lecture.content + content;
        await lecture.save();
    }

    console.log('Data flushed from Redis to MongoDB');
});

export {storePayloadToRedis, client, addMetaData, getMetaData};
