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
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto, UpdateAssignmentDto } from './assignment.dto';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/role.enum';

@ApiTags('Assignments')
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  @ApiOperation({ summary: 'List all assignments' })
  @ApiResponse({ status: 200, description: 'Returns all assignments.' })
  findAll() {
    return this.assignmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an assignment by ID' })
  @ApiParam({ name: 'id', description: 'Assignment ID' })
  @ApiResponse({ status: 200, description: 'Returns the assignment.' })
  @ApiResponse({ status: 404, description: 'Assignment not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.assignmentsService.findOne(id);
  }

  @Post()
  @Roles(Role.Admin)
  @ApiSecurity('x-role')
  @ApiOperation({ summary: 'Create a new assignment (admin only)' })
  @ApiResponse({ status: 201, description: 'Assignment created.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  create(@Body() createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentsService.create(createAssignmentDto);
  }

  @Put(':id')
  @Roles(Role.Admin)
  @ApiSecurity('x-role')
  @ApiOperation({ summary: 'Update an assignment (admin only)' })
  @ApiParam({ name: 'id', description: 'Assignment ID' })
  @ApiResponse({ status: 200, description: 'Assignment updated.' })
  @ApiResponse({ status: 404, description: 'Assignment not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    return this.assignmentsService.update(id, updateAssignmentDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiSecurity('x-role')
  @ApiOperation({ summary: 'Delete an assignment (admin only)' })
  @ApiParam({ name: 'id', description: 'Assignment ID' })
  @ApiResponse({ status: 204, description: 'Assignment deleted.' })
  @ApiResponse({ status: 404, description: 'Assignment not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.assignmentsService.remove(id);
  }
}
