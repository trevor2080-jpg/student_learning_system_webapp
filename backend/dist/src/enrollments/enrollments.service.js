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
exports.EnrollmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const student_entity_1 = require("../students/student.entity");
const course_entity_1 = require("../courses/course.entity");
let EnrollmentsService = class EnrollmentsService {
    constructor(studentsRepository, coursesRepository) {
        this.studentsRepository = studentsRepository;
        this.coursesRepository = coursesRepository;
    }
    async getEnrollments() {
        const courses = await this.coursesRepository.find({
            relations: ['students', 'students.profile', 'assignments'],
            order: { title: 'ASC' },
        });
        return courses;
    }
    async enroll(studentId, courseId) {
        const student = await this.studentsRepository.findOne({
            where: { id: studentId },
            relations: ['courses'],
        });
        if (!student)
            throw new common_1.NotFoundException(`Student #${studentId} not found`);
        const course = await this.coursesRepository.findOne({
            where: { id: courseId },
        });
        if (!course)
            throw new common_1.NotFoundException(`Course #${courseId} not found`);
        const alreadyEnrolled = student.courses.some((c) => c.id === courseId);
        if (alreadyEnrolled)
            throw new common_1.ConflictException('Student already enrolled in this course');
        student.courses.push(course);
        await this.studentsRepository.save(student);
        return { message: `Student ${student.name} enrolled in ${course.title}` };
    }
    async unenroll(studentId, courseId) {
        const student = await this.studentsRepository.findOne({
            where: { id: studentId },
            relations: ['courses'],
        });
        if (!student)
            throw new common_1.NotFoundException(`Student #${studentId} not found`);
        const course = await this.coursesRepository.findOne({
            where: { id: courseId },
        });
        if (!course)
            throw new common_1.NotFoundException(`Course #${courseId} not found`);
        const isEnrolled = student.courses.some((c) => c.id === courseId);
        if (!isEnrolled)
            throw new common_1.ConflictException('Student is not enrolled in this course');
        student.courses = student.courses.filter((c) => c.id !== courseId);
        await this.studentsRepository.save(student);
        return { message: `Student ${student.name} unenrolled from ${course.title}` };
    }
};
exports.EnrollmentsService = EnrollmentsService;
exports.EnrollmentsService = EnrollmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(1, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], EnrollmentsService);
//# sourceMappingURL=enrollments.service.js.map