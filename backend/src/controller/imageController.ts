import { Request, Response, NextFunction } from 'express';
import User from '../model/User';
import Image from '../model/Image';


interface CustomError extends Error {
    statusCode?: number;
  }

export const addImagesToUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("in adding images======>",req.body)
    const userId = (req as any).userId;
    const { imageIds } = req.body;

    if (!Array.isArray(imageIds)) {
      const error = new Error('Invalid input format. Expected an array of image IDs.') as CustomError;
      error.statusCode = 400;
      throw error;
    }

    // Verify all images exist and belong to the user
    const images = await Image.find({ _id: { $in: imageIds }, userId });

    if (images.length !== imageIds.length) {
      const error = new Error('One or more image IDs are invalid or unauthorized.') as CustomError;
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found') as CustomError;
      error.statusCode = 404;
      throw error;
    }

    // Add new image IDs to the user's imageArray, maintaining the order
    user.imageArray = [...user.imageArray,...imageIds];
    await user.save();

    res.status(200).json({ message: 'Images added to user successfully', updatedImageArray: user.imageArray });
  } catch (error) {
    next(error);
  }
};


export const getUserImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
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
    const { imageArray } = req.body;
    const userId = (req as any).userId;

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
    const userId = (req as any).userId;

    const image = await Image.findOneAndUpdate(
      { _id: id, userId },
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
    const { id } = req.params;
    const userId = (req as any).userId;

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
