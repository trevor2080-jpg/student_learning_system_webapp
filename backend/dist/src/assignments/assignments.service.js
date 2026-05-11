"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const assignment_entity_1 = require("./assignment.entity");
const course_entity_1 = require("../courses/course.entity");
let AssignmentsService = class AssignmentsService {
    constructor(assignmentsRepository, coursesRepository) {
        this.assignmentsRepository = assignmentsRepository;
        this.coursesRepository = coursesRepository;
    }
    async findAll() {
        return this.assignmentsRepository.find({
            relations: ['course'],
            order: { dueDate: 'ASC' },
        });
    }
    async findOne(id) {
        const assignment = await this.assignmentsRepository.findOne({
            where: { id },
            relations: ['course'],
        });
        if (!assignment)
            throw new common_1.NotFoundException(`Assignment #${id} not found`);
        return assignment;
    }
    async findByCourse(courseId) {
        return this.assignmentsRepository.find({
            where: { courseId },
            relations: ['course'],
        });
    }
    async create(createAssignmentDto) {
        const course = await this.coursesRepository.findOne({
            where: { id: createAssignmentDto.courseId },
        });
        if (!course)
            throw new common_1.NotFoundException(`Course #${createAssignmentDto.courseId} not found`);
        const assignment = this.assignmentsRepository.create(createAssignmentDto);
        return this.assignmentsRepository.save(assignment);
    }
    async update(id, updateAssignmentDto) {
        const assignment = await this.findOne(id);
        if (updateAssignmentDto.courseId) {
            const course = await this.coursesRepository.findOne({
                where: { id: updateAssignmentDto.courseId },
            });
            if (!course)
                throw new common_1.NotFoundException(`Course #${updateAssignmentDto.courseId} not found`);
        }
        Object.assign(assignment, updateAssignmentDto);
        return this.assignmentsRepository.save(assignment);
    }
    async remove(id) {
        const assignment = await this.findOne(id);
        await this.assignmentsRepository.remove(assignment);
    }
};
exports.AssignmentsService = AssignmentsService;
exports.AssignmentsService = AssignmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(assignment_entity_1.Assignment)),
    __param(1, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AssignmentsService);
//# sourceMappingURL=assignments.service.js.map