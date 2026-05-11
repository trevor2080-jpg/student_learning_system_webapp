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
exports.AssignmentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const assignments_service_1 = require("./assignments.service");
const assignment_dto_1 = require("./assignment.dto");
const roles_decorator_1 = require("../common/roles.decorator");
const role_enum_1 = require("../common/role.enum");
let AssignmentsController = class AssignmentsController {
    constructor(assignmentsService) {
        this.assignmentsService = assignmentsService;
    }
    findAll() {
        return this.assignmentsService.findAll();
    }
    findOne(id) {
        return this.assignmentsService.findOne(id);
    }
    create(createAssignmentDto) {
        return this.assignmentsService.create(createAssignmentDto);
    }
    update(id, updateAssignmentDto) {
        return this.assignmentsService.update(id, updateAssignmentDto);
    }
    remove(id) {
        return this.assignmentsService.remove(id);
    }
};
exports.AssignmentsController = AssignmentsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all assignments' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns all assignments.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AssignmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an assignment by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Assignment ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the assignment.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Assignment not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AssignmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, swagger_1.ApiSecurity)('x-role'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new assignment (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Assignment created.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Course not found.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden. Admin role required.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assignment_dto_1.CreateAssignmentDto]),
    __metadata("design:returntype", void 0)
], AssignmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, swagger_1.ApiSecurity)('x-role'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an assignment (admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Assignment ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assignment updated.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Assignment not found.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden. Admin role required.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, assignment_dto_1.UpdateAssignmentDto]),
    __metadata("design:returntype", void 0)
], AssignmentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiSecurity)('x-role'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an assignment (admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Assignment ID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Assignment deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Assignment not found.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden. Admin role required.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AssignmentsController.prototype, "remove", null);
exports.AssignmentsController = AssignmentsController = __decorate([
    (0, swagger_1.ApiTags)('Assignments'),
    (0, common_1.Controller)('assignments'),
    __metadata("design:paramtypes", [assignments_service_1.AssignmentsService])
], AssignmentsController);
//# sourceMappingURL=assignments.controller.js.map