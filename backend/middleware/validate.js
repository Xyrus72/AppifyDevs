import { validationResult } from 'express-validator';

/**
 * If validation rules produced errors, send 400 and stop. Otherwise call next().
 */
export function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
}
