import { OrderService } from './commandes.service';
import { OrderDto } from './commandes.dto';
import { Order } from './commandes.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

describe('OrderService', () => {
  let service: OrderService;
  let repository: Repository<Order>;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DBHOST,
          port: 5432,
          username: process.env.DBUSER,
          password: process.env.DBPASS,
          database: process.env.DBNAME,
          entities: [Order],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([Order]),
      ],
      providers: [OrderService],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get<Repository<Order>>(getRepositoryToken(Order));
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await repository.clear();
  });

  const orderDto: OrderDto = {
    user: 10,
    content: [
      { product: 1, quantity: 1 },
      { product: 1, quantity: 1 },
    ],
  };

  it('should create a order', async () => {
    const result = await service.createOrder(orderDto);
    expect(result).toEqual({ id: expect.any(Number), ...orderDto });
  });

  it('should update a order', async () => {
    const createdOrder = await service.createOrder(orderDto);
    const updatedOrderDto = { ...orderDto, user: 1 };
    const result = await service.updateOrder(updatedOrderDto, createdOrder.id);
    expect(result).toEqual({ id: createdOrder.id, ...updatedOrderDto });
  });

  it('should get all orders', async () => {
    const order1 = await service.createOrder({
      ...orderDto,
      user: 1,
    });
    const order2 = await service.createOrder({
      ...orderDto,
      user: 1,
    });
    const result = await service.getAllPolls();
    expect(result).toEqual([order1, order2]);
  });

  it('should delete a order', async () => {
    const createdOrder = await service.createOrder(orderDto);
    await service.deleteOrder(createdOrder.id);
    const result = await repository.findOneBy({ id: createdOrder.id });
    expect(result).toBeNull();
  });
});
