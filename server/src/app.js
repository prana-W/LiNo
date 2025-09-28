import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js';
import checkHealth from './controllers/checkHealth.controller.js';
import {errorHandler} from './middlewares/index.js';

const app = express();

// Necessary Middlewares
// app.use(
//     cors({
//         origin: process.env.CORS_ORIGIN,
//         credentials: true,
//     })
// );

app.use(express.json());

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());

// API Routes

app.get('/api/v1/check-health', checkHealth);
app.use('/api/v1/users', userRouter);

// Error Handling
app.use(errorHandler);

export default app;
