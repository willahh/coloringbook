/**
 * Middleware to introduce an artificial delay in the request processing.
 *
 * This middleware reads the `delay` query parameter from the request and
 * delays the processing of the request by the specified number of milliseconds.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 *
 * @example
 * // If the request URL is /api/resource?delay=1000, the response will be delayed by 1 second.
 * app.use('/api/resource', delayMiddleware);
 */
import { Request, Response, NextFunction } from 'express';

export const delayMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('delayMiddleware');
  const delay = parseInt((req.query.delay as string) ?? '0', 10);
  console.log('delay', delay);
  if (delay > 0) {
    setTimeout(() => next(), delay);
  } else {
    next();
  }
};
