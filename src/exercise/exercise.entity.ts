import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column()
  exercise_muscle_category: string;
}
