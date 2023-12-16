import { Order } from 'src/orders/order.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: null, nullable: true })
  resetPasswordToken: string;

  @Column({ default: null, nullable: true })
  confirmationToken: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Order, (order) => order.user, {
    nullable: true,
  })
  orders: Order[];
}
