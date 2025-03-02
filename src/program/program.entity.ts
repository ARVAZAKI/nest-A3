import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Program {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  program_name: string;

  @Column()
  program_description: string;
}
