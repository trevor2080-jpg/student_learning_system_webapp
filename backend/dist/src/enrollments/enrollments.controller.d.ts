import { EnrollmentsService } from './enrollments.service';
export declare class EnrollmentsController {
    private readonly enrollmentsService;
    constructor(enrollmentsService: EnrollmentsService);
    getEnrollments(): Promise<import("../courses/course.entity").Course[]>;
    enroll(studentId: number, courseId: number): Promise<{
        message: string;
    }>;
    unenroll(studentId: number, courseId: number): Promise<{
        message: string;
    }>;
}
