import { Course } from '../courses/course.entity';
export declare class Assignment {
    id: number;
    title: string;
    dueDate: string;
    description: string;
    course: Course;
    courseId: number;
    createdAt: Date;
    updatedAt: Date;
}
