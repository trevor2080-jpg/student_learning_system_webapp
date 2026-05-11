import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../students/student.entity';
import { Course } from '../courses/course.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async getEnrollments() {
    const courses = await this.coursesRepository.find({
      relations: ['students', 'students.profile', 'assignments'],
      order: { title: 'ASC' },
    });
    return courses;
  }

  async enroll(studentId: number, courseId: number): Promise<{ message: string }> {
    const student = await this.studentsRepository.findOne({
      where: { id: studentId },
      relations: ['courses'],
    });
    if (!student) throw new NotFoundException(`Student #${studentId} not found`);

    const course = await this.coursesRepository.findOne({
      where: { id: courseId },
    });
    if (!course) throw new NotFoundException(`Course #${courseId} not found`);

    const alreadyEnrolled = student.courses.some((c) => c.id === courseId);
    if (alreadyEnrolled) throw new ConflictException('Student already enrolled in this course');

    student.courses.push(course);
    await this.studentsRepository.save(student);

    return { message: `Student ${student.name} enrolled in ${course.title}` };
  }

  async unenroll(studentId: number, courseId: number): Promise<{ message: string }> {
    const student = await this.studentsRepository.findOne({
      where: { id: studentId },
      relations: ['courses'],
    });
    if (!student) throw new NotFoundException(`Student #${studentId} not found`);

    const course = await this.coursesRepository.findOne({
      where: { id: courseId },
    });
    if (!course) throw new NotFoundException(`Course #${courseId} not found`);

    const isEnrolled = student.courses.some((c) => c.id === courseId);
    if (!isEnrolled) throw new ConflictException('Student is not enrolled in this course');

    student.courses = student.courses.filter((c) => c.id !== courseId);
    await this.studentsRepository.save(student);

    return { message: `Student ${student.name} unenrolled from ${course.title}` };
  }
}
