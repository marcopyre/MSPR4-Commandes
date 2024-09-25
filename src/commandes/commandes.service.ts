/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './commandes.entity';
import { OrderDto } from './commandes.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async createOrder(dto: OrderDto): Promise<Order> {
    const order = this.orderRepository.create(dto);
    return this.orderRepository.save(order);
  }

  async updateOrder(dto: OrderDto, id: number): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ id });

    const updatedOrder = {
      ...dto,
      id: order.id,
    };

    return this.orderRepository.save(updatedOrder);
  }

  async getAllPolls(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async deleteOrder(id: number) {
    return await this.orderRepository.delete(id);
  }
}
