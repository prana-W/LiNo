import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js';
import checkHealth from "./controllers/checkHealth.controller.js";
import {errorHandler} from "./middlewares/index.js";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);


app.use(
    express.json({
        limit: '20kb',
    })
);
app.use(errorHandler);
app.use(express.urlencoded({extended: true, limit: '20kb'}));
app.use(express.static('public'));
app.use(cookieParser());
app.get('/api/v1/check-health', checkHealth);


//Routes Declaration
app.use('/api/v1/user', userRouter);

// Error Handling


export default app;