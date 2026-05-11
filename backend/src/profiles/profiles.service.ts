import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { Student } from '../students/student.entity';
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  async findAll(): Promise<Profile[]> {
    return this.profilesRepository.find({ relations: ['student'] });
  }

  async findOne(id: number): Promise<Profile> {
    const profile = await this.profilesRepository.findOne({
      where: { id },
      relations: ['student'],
    });
    if (!profile) throw new NotFoundException(`Profile #${id} not found`);
    return profile;
  }

  async findByStudent(studentId: number): Promise<Profile> {
    const student = await this.studentsRepository.findOne({
      where: { id: studentId },
      relations: ['profile'],
    });
    if (!student) throw new NotFoundException(`Student #${studentId} not found`);
    if (!student.profile) throw new NotFoundException(`No profile for student #${studentId}`);
    return student.profile;
  }

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const student = await this.studentsRepository.findOne({
      where: { id: createProfileDto.studentId },
      relations: ['profile'],
    });
    if (!student) throw new NotFoundException(`Student #${createProfileDto.studentId} not found`);
    if (student.profile) throw new ConflictException('Student already has a profile');

    const profile = this.profilesRepository.create({
      bio: createProfileDto.bio,
      avatarUrl: createProfileDto.avatarUrl,
    });
    const savedProfile = await this.profilesRepository.save(profile);

    student.profile = savedProfile;
    await this.studentsRepository.save(student);

    return this.findOne(savedProfile.id);
  }

  async update(id: number, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.findOne(id);
    Object.assign(profile, { bio: updateProfileDto.bio, avatarUrl: updateProfileDto.avatarUrl });
    return this.profilesRepository.save(profile);
  }

  async remove(id: number): Promise<void> {
    const profile = await this.findOne(id);
    // Detach from student first
    const student = await this.studentsRepository.findOne({
      where: { profile: { id } },
      relations: ['profile'],
    });
    if (student) {
      student.profile = null;
      await this.studentsRepository.save(student);
    }
    await this.profilesRepository.remove(profile);
  }
}
