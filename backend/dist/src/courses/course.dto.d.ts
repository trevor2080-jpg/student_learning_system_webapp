export declare class CreateCourseDto {
    title: string;
    code: string;
    description?: string;
}
declare const UpdateCourseDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateCourseDto>>;
export declare class UpdateCourseDto extends UpdateCourseDto_base {
}
export {};
