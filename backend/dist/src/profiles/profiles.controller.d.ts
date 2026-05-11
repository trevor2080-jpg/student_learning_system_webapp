import { ProfilesService } from './profiles.service';
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';
export declare class ProfilesController {
    private readonly profilesService;
    constructor(profilesService: ProfilesService);
    findAll(): Promise<import("./profile.entity").Profile[]>;
    findOne(id: number): Promise<import("./profile.entity").Profile>;
    create(createProfileDto: CreateProfileDto): Promise<import("./profile.entity").Profile>;
    update(id: number, updateProfileDto: UpdateProfileDto): Promise<import("./profile.entity").Profile>;
    remove(id: number): Promise<void>;
}
