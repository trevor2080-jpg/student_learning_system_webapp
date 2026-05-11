import { Profile } from '../profiles/profile.entity';
import { Course } from '../courses/course.entity';
import { Role } from '../common/role.enum';
export declare class Student {
    id: number;
    name: string;
    email: string;
    role: Role;
    profile: Profile;
    courses: Course[];
    createdAt: Date;
    deletedAt: Date | null;
    updatedAt: Date;
}
