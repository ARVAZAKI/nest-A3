import { Exercise } from 'src/exercise/exercise.entity';
import { History } from 'src/history/history.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Program {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  program_image: string;

  @Column()
  program_name: string;

  @Column()
  program_description: string;

  @Column()
  calorie: number;

  @OneToMany(() => Exercise, (exercise) => exercise.program)
  exercises: Exercise[];

  @OneToMany(() => History, (history) => history.program)
  history: History[];
}
