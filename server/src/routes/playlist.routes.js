import router from 'express';

const playlistRouter = router();

router.route('/add-playlist').post();

export default playlistRouter;
