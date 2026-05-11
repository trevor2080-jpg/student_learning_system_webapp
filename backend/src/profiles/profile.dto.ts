import { IsString, IsOptional, IsUrl, IsInt, IsPositive, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiPropertyOptional({ example: 'Computer Science student interested in AI.', maxLength: 1000 })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  bio?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.png', description: 'Publicly accessible image URL' })
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({ example: 1, description: 'ID of the student this profile belongs to' })
  @IsInt()
  @IsPositive()
  studentId: number;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
