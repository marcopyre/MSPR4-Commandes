import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './commandes.service';
import { Product } from './commandes.entity';
import { Repository } from 'typeorm';
import { AppModule } from '../app.module';

describe('ProductService', () => {
  let app: INestApplication;
  let service: ProductService;
  let repository: Repository<Product>;
  let product: Product;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>('ProductRepository');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    product = await repository.create({
      user: 10,
      content: [],
    });
    await repository.save(product);
  });

  afterEach(async () => {
    await repository.clear();
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const newProduct = await service.createProduct({
        user: 5,
        content: [],
      });

      expect(newProduct).toBeDefined();
      expect(newProduct.id).toBeDefined();
      expect(newProduct.user).toEqual(5);
      expect(newProduct.content).toEqual([]);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const updatedProduct = await service.updateProduct(
        {
          user: 7,
          content: [],
        },
        product.id,
      );

      expect(updatedProduct).toBeDefined();
      expect(updatedProduct.id).toEqual(product.id);
      expect(updatedProduct.user).toEqual(7);
      expect(updatedProduct.content).toEqual([]);
    });
  });

  describe('getAllProducts', () => {
    it('should return an array of products', async () => {
      const products = await service.getAllPolls();

      expect(products).toBeInstanceOf(Array);
      expect(products.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      await service.deleteProduct(product.id);

      const deletedProduct = await repository.findOneBy({ id: product.id });
      expect(deletedProduct).toBeNull();
    });
  });
});
