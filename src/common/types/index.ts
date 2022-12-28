import { ApiResponseProperty } from '@nestjs/swagger';

class ErrorType {
  @ApiResponseProperty() status: number;
  @ApiResponseProperty() correlationId: string;
  @ApiResponseProperty() path: string;
  @ApiResponseProperty() method: string;
  @ApiResponseProperty() message: string | object | null;
  @ApiResponseProperty() details: string | object | undefined;
}
export class ResponseErrorType {
  @ApiResponseProperty() error: ErrorType;
}
