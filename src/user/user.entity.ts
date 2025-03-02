import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  food_name: string;

  @Column()
  food_category: string;

  @Column()
  food_image: string;

  @Column()
  food_description: string;
}
