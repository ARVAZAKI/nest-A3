import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  exercise_name: string;

  @Column()
  exercise_asset: string;

  @Column()
  exercise_category: string;

  @Column()
  exercise_muscle_category: string;


  @Column({ type: 'int', nullable: true }) 
  exercise_reps?: number;

  @Column({ type: 'float', nullable: true }) // (dalam detik)
  exercise_duration?: number;
}
