import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column()
  tinggi_badan: number;

  @Column()
  berat_badan: number;

  @Column()
  usia: number;

  @Column()
  jenis_kelamin: string;

  @Column()
  tujuan_workout: string;
}
