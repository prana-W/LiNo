import dotenv from 'dotenv';
dotenv.config({
    path: `./.env`,
});

import connectToDatabase from './connection/index.js';
import app from './app.js';

const port = process.env.PORT || 8000;


connectToDatabase()
.then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
.catch((err) => {
    console.error('There was an error connecting to the database', err);
})