import { ApiProperty } from '@nestjs/swagger';

/**
 * Base response wrapper for all API responses
 * Provides consistent structure across the application
 */
export class BaseResponseDto<T> {
  @ApiProperty({ description: 'Indicates if the request was successful' })
  success: boolean;

  @ApiProperty({ description: 'Response data' })
  data?: T;

  @ApiProperty({ description: 'Error message if failed', required: false })
  error?: string;

  @ApiProperty({ description: 'Error code if failed', required: false })
  errorCode?: string;

  @ApiProperty({ description: 'Request timestamp' })
  timestamp: string;

  @ApiProperty({ description: 'Request ID for tracing' })
  requestId: string;

  constructor(partial: Partial<BaseResponseDto<T>>) {
    Object.assign(this, partial);
    this.timestamp = this.timestamp || new Date().toISOString();
  }
}

/**
 * Paginated response wrapper
 */
export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Array of items' })
  items: T[];

  @ApiProperty({ description: 'Total number of items' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ description: 'Indicates if there is a next page' })
  hasNext: boolean;

  @ApiProperty({ description: 'Indicates if there is a previous page' })
  hasPrev: boolean;

  constructor(items: T[], total: number, page: number, limit: number) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
    this.hasNext = page < this.totalPages;
    this.hasPrev = page > 1;
  }
}

/**
 * Pagination query DTO
 */
export class PaginationQueryDto {
  @ApiProperty({
    description: 'Page number',
    required: false,
    default: 1,
    minimum: 1,
  })
  page?: number = 1;

  @ApiProperty({
    description: 'Items per page',
    required: false,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  limit?: number = 10;

  @ApiProperty({ description: 'Sort field', required: false })
  sortBy?: string;

  @ApiProperty({
    description: 'Sort order',
    required: false,
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  sortOrder?: 'asc' | 'desc' = 'desc';
}
