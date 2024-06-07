import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: number;

  @Column({ type: 'json' })
  content: { product: number; quantity: number }[];
}
