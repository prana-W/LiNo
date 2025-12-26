import router from 'express';
import {
    getAllNotes,
    getParticularNotes,
} from '../controllers/notes.controller.js';

const notesRouter = router();

notesRouter.route('/').get(getAllNotes);
notesRouter.route('/:notesId').get(getParticularNotes); // Todo: Add get notes by id controller

export default notesRouter;
