import { randomUUID } from 'crypto';

export const generateUUID = () => randomUUID();

export const getPaginationOffset = (page: number, limit: number) => {
  return (page - 1) * limit;
};
