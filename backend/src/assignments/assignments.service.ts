import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { Course } from '../courses/course.entity';
import { CreateAssignmentDto, UpdateAssignmentDto } from './assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentsRepository: Repository<Assignment>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async findAll(): Promise<Assignment[]> {
    return this.assignmentsRepository.find({
      relations: ['course'],
      order: { dueDate: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Assignment> {
    const assignment = await this.assignmentsRepository.findOne({
      where: { id },
      relations: ['course'],
    });
    if (!assignment) throw new NotFoundException(`Assignment #${id} not found`);
    return assignment;
  }

  async findByCourse(courseId: number): Promise<Assignment[]> {
    return this.assignmentsRepository.find({
      where: { courseId },
      relations: ['course'],
    });
  }

  async create(createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    const course = await this.coursesRepository.findOne({
      where: { id: createAssignmentDto.courseId },
    });
    if (!course) throw new NotFoundException(`Course #${createAssignmentDto.courseId} not found`);

    const assignment = this.assignmentsRepository.create(createAssignmentDto);
    return this.assignmentsRepository.save(assignment);
  }

  async update(id: number, updateAssignmentDto: UpdateAssignmentDto): Promise<Assignment> {
    const assignment = await this.findOne(id);
    if (updateAssignmentDto.courseId) {
      const course = await this.coursesRepository.findOne({
        where: { id: updateAssignmentDto.courseId },
      });
      if (!course) throw new NotFoundException(`Course #${updateAssignmentDto.courseId} not found`);
    }
    Object.assign(assignment, updateAssignmentDto);
    return this.assignmentsRepository.save(assignment);
  }

  async remove(id: number): Promise<void> {
    const assignment = await this.findOne(id);
    await this.assignmentsRepository.remove(assignment);
  }
}
