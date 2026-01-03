import router from 'express';
import {
    getAllNotes,
    getParticularNotes,
    addTextContent,
    addScreenshot,
    allNotesContent
} from '../controllers/notes.controller.js';
import verifyExistingNotes from "../middlewares/verifyExistingNotes.js";
import upload from "../middlewares/multer.js";

const notesRouter = router();

notesRouter.route('/').get(getAllNotes);
notesRouter.route('/:notesId').get(getParticularNotes);
notesRouter.route('/addText').put(verifyExistingNotes, addTextContent);
notesRouter.route('/addScreenshot').put(upload.single('screenshot'), verifyExistingNotes, addScreenshot);

notesRouter.get(
    "/content/:notesId",
    allNotesContent
);


export default notesRouter;
