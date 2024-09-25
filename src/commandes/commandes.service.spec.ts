import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './commandes.service';
import { Order } from './commandes.entity';
import { Repository } from 'typeorm';
import { AppModule } from '../app.module';

describe('OrderService', () => {
  let app: INestApplication;
  let service: OrderService;
  let repository: Repository<Order>;
  let order: Order;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    service = module.get<OrderService>(OrderService);
    repository = module.get<Repository<Order>>('OrderRepository');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    order = await repository.create({
      user: 10,
      content: [],
    });
    await repository.save(order);
  });

  afterEach(async () => {
    await repository.clear();
  });

  describe('createOrder', () => {
    it('should create a order', async () => {
      const newOrder = await service.createOrder({
        user: 5,
        content: [],
      });

      expect(newOrder).toBeDefined();
      expect(newOrder.id).toBeDefined();
      expect(newOrder.user).toEqual(5);
      expect(newOrder.content).toEqual([]);
    });
  });

  describe('updateOrder', () => {
    it('should update a order', async () => {
      const updatedOrder = await service.updateOrder(
        {
          user: 7,
          content: [],
        },
        order.id,
      );

      expect(updatedOrder).toBeDefined();
      expect(updatedOrder.id).toEqual(order.id);
      expect(updatedOrder.user).toEqual(7);
      expect(updatedOrder.content).toEqual([]);
    });
  });

  describe('getAllOrders', () => {
    it('should return an array of orders', async () => {
      const orders = await service.getAllPolls();

      expect(orders).toBeInstanceOf(Array);
      expect(orders.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('deleteOrder', () => {
    it('should delete a order', async () => {
      await service.deleteOrder(order.id);

      const deletedOrder = await repository.findOneBy({ id: order.id });
      expect(deletedOrder).toBeNull();
    });
  });
});
