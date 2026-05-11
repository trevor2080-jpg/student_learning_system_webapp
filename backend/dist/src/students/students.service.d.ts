import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { CreateStudentDto, UpdateStudentDto } from './student.dto';
export declare class StudentsService {
    private studentsRepository;
    constructor(studentsRepository: Repository<Student>);
    findAll(): Promise<Student[]>;
    findOne(id: number): Promise<Student>;
    create(createStudentDto: CreateStudentDto): Promise<Student>;
    update(id: number, updateStudentDto: UpdateStudentDto): Promise<Student>;
    remove(id: number): Promise<void>;
    restore(id: number): Promise<Student>;
}
