import { Repository } from 'typeorm';
import { Student } from '../students/student.entity';
import { Course } from '../courses/course.entity';
export declare class EnrollmentsService {
    private studentsRepository;
    private coursesRepository;
    constructor(studentsRepository: Repository<Student>, coursesRepository: Repository<Course>);
    getEnrollments(): Promise<Course[]>;
    enroll(studentId: number, courseId: number): Promise<{
        message: string;
    }>;
    unenroll(studentId: number, courseId: number): Promise<{
        message: string;
    }>;
}
