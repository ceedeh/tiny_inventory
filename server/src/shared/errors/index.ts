export class HttpException extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public name = 'HttpException'
  ) {
    super(message);
  }
}

export class NotFoundException extends HttpException {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NotFoundException');
  }
}

export class BadRequestException extends HttpException {
  constructor(message = 'Bad request') {
    super(message, 400, 'BadRequestException');
  }
}

export class InternalServerException extends HttpException {
  constructor(message = 'Internal server error') {
    super(message, 500, 'InternalServerException');
  }
}
