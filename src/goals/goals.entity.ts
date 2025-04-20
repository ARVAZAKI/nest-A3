import { User } from '../user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Goals {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    weekly_workout: number;

    @ManyToOne(() => User, (user) => user.goals, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    user: User;
}