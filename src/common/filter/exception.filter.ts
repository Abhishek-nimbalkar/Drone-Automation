import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';

function isPrismaClientKnownRequestError(
  error: unknown,
): error is PrismaClientKnownRequestError {
  return error instanceof PrismaClientKnownRequestError;
}

@Catch(
  BadRequestException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  PrismaClientKnownRequestError,
)
export class GlobalExceptionHandler implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    let clientError;
    let status;

    if (isPrismaClientKnownRequestError(exception)) {
      // Now TypeScript knows exception is PrismaClientKnownRequestError
      switch (exception.code) {
        case 'P2002':
          clientError = 'Unique constraint violation';
          status = 409;
          break;
        case 'P2016':
          clientError = 'Record not found';
          status = 404;
          break;
        case 'P2025':
          clientError = 'No default value';
          status = 400;
        case 'P2003':
          clientError = 'Foreign key constraint violation';
          status = 409;
          break;
        // Add more cases as needed
        default:
          clientError = exception.meta?.cause || exception.message;
          status = 500; // Default to 500 for unknown Prisma errors
      }
    } else if (exception instanceof BadRequestException) {
      // Enhanced handling for BadRequestException
      const badRequestException = exception;
      if (Array.isArray(badRequestException.message)) {
        // Assuming the first item in the array is the actual error message
        clientError = badRequestException.message[0];
        status = 400;
      } else {
        clientError = badRequestException.message || 'Bad Request';
        status = 400;
      }
    } else {
      // Handle other exceptions
      clientError =
        exception instanceof Error
          ? exception.message
          : 'Internal Server Error';
      status =
        exception instanceof BadRequestException
          ? 400
          : exception instanceof NotFoundException
            ? 404
            : exception instanceof ConflictException
              ? 409
              : exception instanceof InternalServerErrorException
                ? 500
                : 500; // Default to 500 for unhandled exceptions
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception instanceof Error ? exception.message : exception,
      error: clientError,
    });
  }
}
