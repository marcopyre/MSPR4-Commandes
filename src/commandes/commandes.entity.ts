import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: number;

  @Column({ type: 'json' })
  content: { product: number; quantity: number }[];
}
