import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Profile } from '../profiles/profile.entity';
import { Course } from '../courses/course.entity';
import { Role } from '../common/role.enum';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: Role, default: Role.Student })
  role: Role;

  // ONE-TO-ONE: Each student has exactly one profile
  @OneToOne(() => Profile, (profile) => profile.student, {
    cascade: true,
    eager: false,
  })
  @JoinColumn()
  profile: Profile;

  // MANY-TO-MANY: Students enroll in many courses; courses have many students
  @ManyToMany(() => Course, (course) => course.students)
  courses: Course[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @UpdateDateColumn()
  updatedAt: Date;
}
