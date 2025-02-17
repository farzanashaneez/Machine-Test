import { v2 as cloudinary } from 'cloudinary'; 
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



const storage = multer.memoryStorage();
export const upload = multer({ storage });


export const uploadToCloudinary = async (req: Request, res: Response, next: NextFunction) => {
  console.log("in cloudinary", req.files, req.body);
  if (!req.files || req.files.length === 0) {
    return next();
  }
  
  try {
    const uploadPromises = (req.files as Express.Multer.File[]).map(async (file, index) => {
      // Using buffer for upload instead of file path
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'ImageApp' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        
        // Create a readable stream from the buffer and pipe to uploadStream
        const Readable = require('stream').Readable;
        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
      });
      
      return {
        url: result.secure_url,
        title: req.body.titles ? req.body.titles[index] : null,
      };
    });
    
    const uploadedImages = await Promise.all(uploadPromises);
    console.log(uploadedImages);
    req.body.uploadedImages = uploadedImages;
    next();
  } catch (error) {
    next(error);
  }
};