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
import { ProfilesService } from './profiles.service';
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/role.enum';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  @ApiOperation({ summary: 'List all profiles' })
  @ApiResponse({ status: 200, description: 'Returns all profiles.' })
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a profile by ID' })
  @ApiParam({ name: 'id', description: 'Profile ID' })
  @ApiResponse({ status: 200, description: 'Returns the profile.' })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.profilesService.findOne(id);
  }

  @Post()
  @Roles(Role.Admin)
  @ApiSecurity('x-role')
  @ApiOperation({ summary: 'Create a profile for a student (admin only)' })
  @ApiResponse({ status: 201, description: 'Profile created.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  @ApiResponse({ status: 409, description: 'Student already has a profile.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(createProfileDto);
  }

  @Put(':id')
  @Roles(Role.Admin)
  @ApiSecurity('x-role')
  @ApiOperation({ summary: 'Update a profile (admin only)' })
  @ApiParam({ name: 'id', description: 'Profile ID' })
  @ApiResponse({ status: 200, description: 'Profile updated.' })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiSecurity('x-role')
  @ApiOperation({ summary: 'Delete a profile (admin only)' })
  @ApiParam({ name: 'id', description: 'Profile ID' })
  @ApiResponse({ status: 204, description: 'Profile deleted.' })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.profilesService.remove(id);
  }
}
