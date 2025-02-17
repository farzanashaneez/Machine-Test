import express, { RequestHandler } from 'express';
import { addImagesToUser, getUserImages, updateImageOrder, editImage, deleteImage } from '../controller/imageController';
import { authenticateUser } from '../middleware/auth'; 
import { upload, uploadToCloudinary } from '../middleware/uploadToCloudinary';

const router = express.Router();

// All routes in this file should be protected
router.use(authenticateUser);

router.post('/add',upload.array('images'), uploadToCloudinary, addImagesToUser);
router.get('/user/:userId', getUserImages as RequestHandler);
router.put('/reorder', updateImageOrder as RequestHandler);
router.put('/:id', editImage as RequestHandler);
router.delete('/:id/user/:userId', deleteImage as RequestHandler);

export default router;
