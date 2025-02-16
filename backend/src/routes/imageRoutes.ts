import express, { RequestHandler } from 'express';
import { addImagesToUser, getUserImages, updateImageOrder, editImage, deleteImage } from '../controller/imageController';
import { authenticateUser } from '../middleware/auth'; 

const router = express.Router();

// All routes in this file should be protected
// router.use(authenticateUser);

router.post('/add', addImagesToUser);
router.get('/user', getUserImages as RequestHandler);
router.put('/reorder', updateImageOrder as RequestHandler);
router.put('/:id', editImage as RequestHandler);
router.delete('/:id', deleteImage as RequestHandler);

export default router;
