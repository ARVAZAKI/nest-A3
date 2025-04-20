import { Program } from "../program/program.entity";
import { User } from "../user/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class History {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.history, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    user: User;

    @ManyToOne(() => Program, (program) => program.history, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'program_id'})
    program: Program;

    @Column({nullable: true})
    total_duration: number;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    date: Date;
}