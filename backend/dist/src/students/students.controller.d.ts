import { StudentsService } from './students.service';
import { CreateStudentDto, UpdateStudentDto } from './student.dto';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    findAll(): Promise<import("./student.entity").Student[]>;
    findOne(id: number): Promise<import("./student.entity").Student>;
    create(createStudentDto: CreateStudentDto): Promise<import("./student.entity").Student>;
    update(id: number, updateStudentDto: UpdateStudentDto): Promise<import("./student.entity").Student>;
    remove(id: number): Promise<void>;
    restore(id: number): Promise<import("./student.entity").Student>;
}
