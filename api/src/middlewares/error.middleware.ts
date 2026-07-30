import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/app-error";

export class ErrorMiddleware {
    public static handleError(
        error: unknown,
        req: Request,
        res: Response,
        _next: NextFunction
    ): void {
        const isProduction = process.env.NODE_ENV === "production";

        if (error instanceof AppError) {
            console.warn({
                message: error.message,
                name: error.name,
                statusCode: error.statusCode,
                path: req.originalUrl,
                method: req.method,
                validationErrors: error.validationErrors,
            });

            res.status(error.statusCode).json({
                success: false,
                name: error.name,
                message: error.message,
                validationErrors: error.validationErrors,
            });
            return;
        }

        console.error({
            message: "Error no controlado",
            path: req.originalUrl,
            method: req.method,
            error,
        });

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            name: "InternalServerError",
            message: "Se produjo un error interno del servidor",
            detail: isProduction ? undefined : error,
        });
    }
}