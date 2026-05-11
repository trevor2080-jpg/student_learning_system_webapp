import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiSecurity } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/role.enum';

@ApiTags('Enrollments')
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get()
  @ApiOperation({ summary: 'List all courses with their enrolled students' })
  @ApiResponse({ status: 200, description: 'Returns all courses with enrollment data.' })
  getEnrollments() {
    return this.enrollmentsService.getEnrollments();
  }

  @Post(':studentId/courses/:courseId')
  @Roles(Role.Admin)
  @ApiSecurity('x-role')
  @ApiOperation({ summary: 'Enroll a student in a course (admin only)' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({ status: 201, description: 'Student enrolled successfully.' })
  @ApiResponse({ status: 404, description: 'Student or course not found.' })
  @ApiResponse({ status: 409, description: 'Student already enrolled in this course.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  enroll(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.enrollmentsService.enroll(studentId, courseId);
  }

  @Delete(':studentId/courses/:courseId')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  @ApiSecurity('x-role')
  @ApiOperation({ summary: 'Unenroll a student from a course (admin only)' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Student unenrolled successfully.' })
  @ApiResponse({ status: 404, description: 'Student or course not found.' })
  @ApiResponse({ status: 409, description: 'Student is not enrolled in this course.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  unenroll(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.enrollmentsService.unenroll(studentId, courseId);
  }
}
