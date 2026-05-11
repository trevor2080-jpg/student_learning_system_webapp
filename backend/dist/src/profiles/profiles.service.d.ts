import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { Student } from '../students/student.entity';
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';
export declare class ProfilesService {
    private profilesRepository;
    private studentsRepository;
    constructor(profilesRepository: Repository<Profile>, studentsRepository: Repository<Student>);
    findAll(): Promise<Profile[]>;
    findOne(id: number): Promise<Profile>;
    findByStudent(studentId: number): Promise<Profile>;
    create(createProfileDto: CreateProfileDto): Promise<Profile>;
    update(id: number, updateProfileDto: UpdateProfileDto): Promise<Profile>;
    remove(id: number): Promise<void>;
}
