// src/decorators/extract-user-id.decorator.ts

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const ExtractUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new Error('Authorization header is missing');
    }

    try {
      const token = authHeader.split(' ')[1]; // Assuming Bearer token format
      const decodedToken = jwt.decode(token); // Replace 'your-secret-key' with your actual secret key

      // Assuming the user ID is stored in the payload under 'userId'
      return decodedToken.sub;
    } catch (error) {
      console.error('Failed to verify token:', error);
      throw new Error('Invalid token');
    }
  },
);
