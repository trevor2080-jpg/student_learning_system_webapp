import { IsNotEmpty, IsString, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'Introduction to Computer Science', minLength: 3, maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  title: string;

  @ApiProperty({ example: 'CS101', description: '2–10 uppercase letters or digits' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9]{2,10}$/, {
    message: 'code must be 2–10 uppercase letters or digits (e.g. CS101)',
  })
  code: string;

  @ApiPropertyOptional({ example: 'Fundamentals of programming and computational thinking.', maxLength: 1000 })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;
}

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
