import { Student } from '../students/student.entity';
import { Assignment } from '../assignments/assignment.entity';
export declare class Course {
    id: number;
    title: string;
    code: string;
    description: string;
    students: Student[];
    assignments: Assignment[];
    createdAt: Date;
    updatedAt: Date;
}
