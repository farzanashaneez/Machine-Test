import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error: any = new Error('No token, authorization denied');
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(' ')[1];
console.log("token===============",token);
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }
    const decoded = jwt.verify(token, jwtSecret) as { userId: string ,email:string};
    console.log("=== decoded===>",decoded)
    req.userId = decoded.userId;
    next();
  } catch (error) {
    const jwtError: any = new Error('Token is not valid');
    jwtError.statusCode = 401;
    next(jwtError);
  }
};
