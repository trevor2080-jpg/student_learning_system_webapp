import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiSecurity } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/role.enum';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'List all courses' })
  @ApiResponse({ status: 200, description: 'Returns all courses.' })
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a course by ID' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Returns the course.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findOne(id);
  }

  @Post()
  @Roles(Role.Admin)
  @ApiSecurity('x-role')
  @ApiOperation({ summary: 'Create a new course (admin only)' })
  @ApiResponse({ status: 201, description: 'Course created.' })
  @ApiResponse({ status: 409, description: 'Course code already exists.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Put(':id')
  @Roles(Role.Admin)
  @ApiSecurity('x-role')
  @ApiOperation({ summary: 'Update a course (admin only)' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course updated.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiSecurity('x-role')
  @ApiOperation({ summary: 'Delete a course (admin only)' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 204, description: 'Course deleted.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.remove(id);
  }
}
