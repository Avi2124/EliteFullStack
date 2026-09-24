import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError.js";
import { ZodError } from "zod";

const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }
  if (
    error.name === "PrismaClientKnownRequestError"
  ) {
    return res.status(400).json({
      success: false,
      message: "Database error",
    });
  }
  console.error(error);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default errorMiddleware;