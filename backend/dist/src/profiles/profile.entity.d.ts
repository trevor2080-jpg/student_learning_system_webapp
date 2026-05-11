import { Student } from '../students/student.entity';
export declare class Profile {
    id: number;
    bio: string;
    avatarUrl: string;
    student: Student;
    createdAt: Date;
    updatedAt: Date;
}
