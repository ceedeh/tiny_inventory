import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { HttpException } from '../errors';

export const errorHandler = (
  err: HttpException | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof HttpException) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } else if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors.reduce(
        (acc, curr) => {
          acc[curr.path.join('.')] = curr.message;
          return acc;
        },
        {} as Record<string, string>
      ),
    });
  }

  console.log('\n\n', err, '\n\n');
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
