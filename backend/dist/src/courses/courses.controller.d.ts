import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    findAll(): Promise<import("./course.entity").Course[]>;
    findOne(id: number): Promise<import("./course.entity").Course>;
    create(createCourseDto: CreateCourseDto): Promise<import("./course.entity").Course>;
    update(id: number, updateCourseDto: UpdateCourseDto): Promise<import("./course.entity").Course>;
    remove(id: number): Promise<void>;
}
