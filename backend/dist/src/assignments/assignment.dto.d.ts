export declare class CreateAssignmentDto {
    title: string;
    dueDate: string;
    description?: string;
    courseId: number;
}
declare const UpdateAssignmentDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateAssignmentDto>>;
export declare class UpdateAssignmentDto extends UpdateAssignmentDto_base {
}
export {};
