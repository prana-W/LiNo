import router from 'express';
import {
    getAllLectures,
    getParticularLecture,
} from '../controllers/lecture.controller.js';

const lectureRouter = router();

lectureRouter.route('/').get(getAllLectures);
lectureRouter.route('/:lectureId').get(getParticularLecture); // Todo: Add get lecture by id controller

export default lectureRouter;
