import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity('routines')
export class Routine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  category: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'date', nullable: true })
  date: string;

  @Column({ type: 'jsonb', nullable: true })
  sets: {
    series: number;
    repetitions: number;
    weight?: string;
    time?: string;
    rest?: string;
  }[];

  @Column({ nullable: true })
  observations: string;

  @ManyToOne(() => User, (user) => user.routines)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
