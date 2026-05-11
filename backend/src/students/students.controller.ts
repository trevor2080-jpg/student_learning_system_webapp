import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiSecurity } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto, UpdateStudentDto } from './student.dto';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/role.enum';

@ApiTags('Students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @ApiOperation({ summary: 'List all students' })
  @ApiResponse({ status: 200, description: 'Returns all non-deleted students.' })
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student by ID' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Returns the student.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.findOne(id);
  }

  @Post()
  @Roles(Role.Admin)
  @ApiSecurity('x-role')
  @ApiOperation({ summary: 'Create a new student (admin only)' })
  @ApiResponse({ status: 201, description: 'Student created.' })
  @ApiResponse({ status: 409, description: 'Email already in use.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Put(':id')
  @Roles(Role.Admin)
  @ApiSecurity('x-role')
  @ApiOperation({ summary: 'Update a student (admin only)' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Student updated.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  @ApiResponse({ status: 409, description: 'Email already in use.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiSecurity('x-role')
  @ApiOperation({ summary: 'Soft-delete a student (admin only)' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({ status: 204, description: 'Student soft-deleted.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.remove(id);
  }

  @Patch(':id/restore')
  @Roles(Role.Admin)
  @ApiSecurity('x-role')
  @ApiOperation({ summary: 'Restore a soft-deleted student (admin only)' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Student restored.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.restore(id);
  }
}
