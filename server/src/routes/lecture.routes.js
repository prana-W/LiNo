import router from 'express';
import {getAllLectures} from "../controllers/lecture.controller.js";

const lectureRouter = router();

lectureRouter.route('/').get(getAllLectures);

export default lectureRouter;
