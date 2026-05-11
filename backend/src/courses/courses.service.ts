import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async findAll(): Promise<Course[]> {
    return this.coursesRepository.find({
      relations: ['assignments', 'students'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: ['assignments', 'students', 'students.profile'],
    });
    if (!course) throw new NotFoundException(`Course #${id} not found`);
    return course;
  }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const existing = await this.coursesRepository.findOne({
      where: { code: createCourseDto.code },
    });
    if (existing) throw new ConflictException('Course code already in use');

    const course = this.coursesRepository.create(createCourseDto);
    return this.coursesRepository.save(course);
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);
    if (updateCourseDto.code && updateCourseDto.code !== course.code) {
      const existing = await this.coursesRepository.findOne({
        where: { code: updateCourseDto.code },
      });
      if (existing) throw new ConflictException('Course code already in use');
    }
    Object.assign(course, updateCourseDto);
    return this.coursesRepository.save(course);
  }

  async remove(id: number): Promise<void> {
    const course = await this.findOne(id);
    await this.coursesRepository.remove(course);
  }
}
