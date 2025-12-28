import router from 'express';
import {
    getAllNotes,
    getParticularNotes,
    addTextContent
} from '../controllers/notes.controller.js';
import verifyExistingNotes from "../middlewares/verifyExistingNotes.js";

const notesRouter = router();

notesRouter.route('/')
    .get(getAllNotes)
notesRouter.route('/:notesId').get(getParticularNotes); // Todo: Add get notes by id controller
notesRouter.route('/addText').put(verifyExistingNotes, addTextContent);

export default notesRouter;
