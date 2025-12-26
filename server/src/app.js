import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import checkHealth from './controllers/checkHealth.controller.js';
import {errorHandler, verifyAccessToken} from './middlewares/index.js';
import {authRateLimiter} from './middlewares/rateLimiter.js';
import morgan from 'morgan';
import {notesRouter} from './routes/index.js';
import serviceRouter from "./routes/services.routes.js";

const app = express();

app.use(morgan('dev'));

const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use(express.json({limit: '100mb'}));

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());

// API Routes

app.get('/', checkHealth);
app.get('/api/v1/check-health', checkHealth);
app.use('/api/v1/auth', authRateLimiter(), authRouter);
app.use('/api/v1/notes', verifyAccessToken, notesRouter); // Todo: Add and configure rate limiters for all

app.use('/api/v1/services', verifyAccessToken, serviceRouter);

// Error Handling
app.use(errorHandler());

export default app;
