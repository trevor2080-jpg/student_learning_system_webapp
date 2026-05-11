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
exports.EnrollmentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const enrollments_service_1 = require("./enrollments.service");
const roles_decorator_1 = require("../common/roles.decorator");
const role_enum_1 = require("../common/role.enum");
let EnrollmentsController = class EnrollmentsController {
    constructor(enrollmentsService) {
        this.enrollmentsService = enrollmentsService;
    }
    getEnrollments() {
        return this.enrollmentsService.getEnrollments();
    }
    enroll(studentId, courseId) {
        return this.enrollmentsService.enroll(studentId, courseId);
    }
    unenroll(studentId, courseId) {
        return this.enrollmentsService.unenroll(studentId, courseId);
    }
};
exports.EnrollmentsController = EnrollmentsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all courses with their enrolled students' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns all courses with enrollment data.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EnrollmentsController.prototype, "getEnrollments", null);
__decorate([
    (0, common_1.Post)(':studentId/courses/:courseId'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, swagger_1.ApiSecurity)('x-role'),
    (0, swagger_1.ApiOperation)({ summary: 'Enroll a student in a course (admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'Course ID' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Student enrolled successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Student or course not found.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Student already enrolled in this course.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden. Admin role required.' }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('courseId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], EnrollmentsController.prototype, "enroll", null);
__decorate([
    (0, common_1.Delete)(':studentId/courses/:courseId'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiSecurity)('x-role'),
    (0, swagger_1.ApiOperation)({ summary: 'Unenroll a student from a course (admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'Course ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Student unenrolled successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Student or course not found.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Student is not enrolled in this course.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden. Admin role required.' }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('courseId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], EnrollmentsController.prototype, "unenroll", null);
exports.EnrollmentsController = EnrollmentsController = __decorate([
    (0, swagger_1.ApiTags)('Enrollments'),
    (0, common_1.Controller)('enrollments'),
    __metadata("design:paramtypes", [enrollments_service_1.EnrollmentsService])
], EnrollmentsController);
//# sourceMappingURL=enrollments.controller.js.map