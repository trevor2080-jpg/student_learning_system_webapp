import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { CreateStudentDto, UpdateStudentDto } from './student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  async findAll(): Promise<Student[]> {
    return this.studentsRepository.find({
      relations: ['profile', 'courses'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Student> {
    const student = await this.studentsRepository.findOne({
      where: { id },
      relations: ['profile', 'courses', 'courses.assignments'],
    });
    if (!student) throw new NotFoundException(`Student #${id} not found`);
    return student;
  }

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const existing = await this.studentsRepository.findOne({
      where: { email: createStudentDto.email },
    });
    if (existing) throw new ConflictException('Email already in use');

    const student = this.studentsRepository.create(createStudentDto);
    return this.studentsRepository.save(student);
  }

  async update(id: number, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);
    if (updateStudentDto.email && updateStudentDto.email !== student.email) {
      const existing = await this.studentsRepository.findOne({
        where: { email: updateStudentDto.email },
      });
      if (existing) throw new ConflictException('Email already in use');
    }
    Object.assign(student, updateStudentDto);
    return this.studentsRepository.save(student);
  }

  async remove(id: number): Promise<void> {
    const student = await this.findOne(id);
    await this.studentsRepository.softRemove(student);
  }

  async restore(id: number): Promise<Student> {
    await this.studentsRepository.restore(id);
    return this.findOne(id);
  }
}
