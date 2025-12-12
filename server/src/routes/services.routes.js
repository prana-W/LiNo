import {Router} from 'express';
import {uploadScreenshot} from '../controllers/services/screenshot.controller.js';
import upload from '../middlewares/multer.js';

const serviceRouter = Router();

serviceRouter.post('/screenshot', upload.single('screenshot'), uploadScreenshot);

export default serviceRouter;