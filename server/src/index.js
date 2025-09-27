import dotenv from 'dotenv';
dotenv.config({
    path: `./.env`,
});

import connectToDatabase from './connection';
import app from './app';

const port = process.env.PORT || 8000;


connectToDatabase()
.then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
.catch((err) => {
    console.log('There was an error connecting to the database', err);
})