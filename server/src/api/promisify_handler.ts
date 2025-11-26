import { IResponse } from '@/shared/types';
import { Request, Response, NextFunction } from 'express';

type Fn = (req: Request, res: Response) => Promise<any>;

export const promisifyHandler = (fn: Fn) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await fn(req, res);

      const response: IResponse<any> = {
        success: true,
        message: 'OK',
        ...(data && {
          data: 'pagination' in data ? data.data : data,
          pagination: 'pagination' in data ? data.pagination : undefined,
        }),
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };
};
