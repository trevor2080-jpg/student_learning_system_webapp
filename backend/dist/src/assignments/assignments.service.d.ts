import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { Course } from '../courses/course.entity';
import { CreateAssignmentDto, UpdateAssignmentDto } from './assignment.dto';
export declare class AssignmentsService {
    private assignmentsRepository;
    private coursesRepository;
    constructor(assignmentsRepository: Repository<Assignment>, coursesRepository: Repository<Course>);
    findAll(): Promise<Assignment[]>;
    findOne(id: number): Promise<Assignment>;
    findByCourse(courseId: number): Promise<Assignment[]>;
    create(createAssignmentDto: CreateAssignmentDto): Promise<Assignment>;
    update(id: number, updateAssignmentDto: UpdateAssignmentDto): Promise<Assignment>;
    remove(id: number): Promise<void>;
}
