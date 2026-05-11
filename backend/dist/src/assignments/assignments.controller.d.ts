import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto, UpdateAssignmentDto } from './assignment.dto';
export declare class AssignmentsController {
    private readonly assignmentsService;
    constructor(assignmentsService: AssignmentsService);
    findAll(): Promise<import("./assignment.entity").Assignment[]>;
    findOne(id: number): Promise<import("./assignment.entity").Assignment>;
    create(createAssignmentDto: CreateAssignmentDto): Promise<import("./assignment.entity").Assignment>;
    update(id: number, updateAssignmentDto: UpdateAssignmentDto): Promise<import("./assignment.entity").Assignment>;
    remove(id: number): Promise<void>;
}
