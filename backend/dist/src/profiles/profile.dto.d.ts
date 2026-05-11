export declare class CreateProfileDto {
    bio?: string;
    avatarUrl?: string;
    studentId: number;
}
declare const UpdateProfileDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateProfileDto>>;
export declare class UpdateProfileDto extends UpdateProfileDto_base {
}
export {};
