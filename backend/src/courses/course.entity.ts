import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from '../students/student.entity';
import { Assignment } from '../assignments/assignment.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // MANY-TO-MANY: A course has many students; a student can enroll in many courses
  @ManyToMany(() => Student, (student) => student.courses)
  @JoinTable({
    name: 'enrollments',
    joinColumn: { name: 'courseId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'studentId', referencedColumnName: 'id' },
  })
  students: Student[];

  // ONE-TO-MANY: A course has many assignments; each assignment belongs to one course
  @OneToMany(() => Assignment, (assignment) => assignment.course, {
    cascade: true,
  })
  assignments: Assignment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
