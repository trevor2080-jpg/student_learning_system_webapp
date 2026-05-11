import { IsNotEmpty, IsString, IsDateString, IsInt, IsPositive, IsOptional, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAssignmentDto {
  @ApiProperty({ example: 'Midterm Project', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: '2026-06-15', description: 'ISO 8601 date string (YYYY-MM-DD)' })
  @IsDateString()
  dueDate: string;

  @ApiPropertyOptional({ example: 'Build a REST API using NestJS.', maxLength: 2000 })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ example: 1, description: 'ID of the course this assignment belongs to' })
  @IsInt()
  @IsPositive()
  courseId: number;
}

export class UpdateAssignmentDto extends PartialType(CreateAssignmentDto) {}
