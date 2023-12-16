import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  products: { productId: number; quantity: number }[];

  @ManyToOne(() => User, (user) => user.orders, {
    nullable: false,
  })
  user: User;
}
