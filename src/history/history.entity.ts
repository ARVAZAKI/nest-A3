import { Program } from "src/program/program.entity";
import { User } from "src/user/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
}