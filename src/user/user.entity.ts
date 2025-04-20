import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { History } from '../history/history.entity';
import { Goals } from '../goals/goals.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({nullable: true})
  tinggi_badan: number;

  @Column({nullable: true})
  berat_badan: number;

  @Column({nullable: true})
  usia: number;

  @Column({nullable: true})
  jenis_kelamin: string;

  @Column({nullable: true})
  tujuan_workout: string;

  @OneToMany(() => History, (history) => history.user)
  history: History[];

  @OneToMany(() => Goals, (goals) => goals.user)
  goals: Goals[];
}
