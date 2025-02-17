import { Request, Response, NextFunction } from 'express';
import User from '../model/User';
import Image from '../model/Image';
import { ObjectId, Types } from 'mongoose';


interface CustomError extends Error {
    statusCode?: number;
  }

  
  export const addImagesToUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId =req.body.userId;
      const imageUrls = req.body.uploadedImages?.map((x:any)=>x.url)
      const titles = req.body.uploadedImages?.map((x:any)=>x.title)
  
      if (!imageUrls || !Array.isArray(imageUrls)) {
        const error = new Error('No images provided') as CustomError;
        error.statusCode = 400;
        throw error;
      }
  
      if (!Array.isArray(titles) || titles.length !== imageUrls.length) {
        const error = new Error('Titles array must match the number of images') as CustomError;
        error.statusCode = 400;
        throw error;
      }
  
      // Create Image documents
      console.log("in controller",userId,titles,imageUrls)

      const createImagePromises = imageUrls.map(async (url, index) => {
        const image = new Image({
          userId,
          title: titles[index],
          url: url,
        });
        return await image.save();
      });
  
      const savedImages = await Promise.all(createImagePromises);
      const imageIds = savedImages.map(image => image._id);
  
      // Update user's imageArray
      const user = await User.findById(userId);
      if (!user) {
        const error = new Error('User not found') as CustomError;
        error.statusCode = 404;
        throw error;
      }
  
      user.imageArray = [...user.imageArray, ...imageIds] as Types.ObjectId[];
      await user.save();
  
      res.status(200).json({
        message: 'Images uploaded and added to user successfully',
        updatedImageArray: user.imageArray,
        images: savedImages
      });
    } catch (error) {
      next(error);
    }
  };


export const getUserImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('imageArray');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.imageArray);
  } catch (error) {
    next(error);
  }
};

export const updateImageOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { imageArray,userId } = req.body;

    if (!Array.isArray(imageArray)) {
      return res.status(400).json({ message: 'imageArray must be an array of image IDs' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { imageArray } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Image order updated successfully', imageArray: user.imageArray });
  } catch (error) {
    next(error);
  }
};

export const editImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const image = await Image.findOneAndUpdate(
      { _id: id},
      { $set: { title } },
      { new: true }
    );

    if (!image) {
      return res.status(404).json({ message: 'Image not found or unauthorized' });
    }

    res.status(200).json({ message: 'Image updated successfully', image });
  } catch (error) {
    next(error);
  }
};

export const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id,userId } = req.params;

    const image = await Image.findOneAndDelete({ _id: id, userId });

    if (!image) {
      return res.status(404).json({ message: 'Image not found or unauthorized' });
    }

    await User.findByIdAndUpdate(userId, { $pull: { imageArray: id } });

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    next(error);
  }
};
