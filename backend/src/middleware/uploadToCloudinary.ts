import { v2 as cloudinary } from 'cloudinary'; 
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
export const upload = multer({ storage });

export const uploadToCloudinary = async (req: Request, res: Response, next: NextFunction) => {
    console.log("in cloudinary",req.files,req.body)
  if (!req.files || req.files.length === 0) {
    return next(); 
  }

  try {
    
    const uploadPromises = (req.files as Express.Multer.File[]).map(async (file, index) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'ImageApp', 
      });

      return {
        url: result.secure_url,
        title: req.body.titles ? req.body.titles[index] : null, 
      };
    });

    
    const uploadedImages = await Promise.all(uploadPromises);
console.log(uploadedImages)
    req.body.uploadedImages = uploadedImages;

    next(); 
  } catch (error) {
    next(error); // Handle any errors
  }
};
