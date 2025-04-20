import { Program } from '../program/program.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Exercise {
@PrimaryGeneratedColumn()
id: number;

@Column()
exercise_name: string;

@Column()
exercise_description: string;

@Column()
exercise_asset: string;

@Column()
exercise_category: string;

@Column({ nullable: true })
repetisi: number;

@Column({ nullable: true })
duration: number;

@ManyToOne(() => Program, (program) => program.exercises, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'program_id' })
program: Program;
}