import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  status: 'pending' | 'in-progress' | 'completed';

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;
}
