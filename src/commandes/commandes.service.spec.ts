import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './commandes.entity';
import { ProductDto } from './commandes.dto';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create and save a product', async () => {
      const dto: ProductDto = {
        user: 5,
        content: [],
      };
      const product = { id: 1, ...dto };
      jest.spyOn(repository, 'create').mockReturnValue(product as any);
      jest.spyOn(repository, 'save').mockResolvedValue(product as any);

      const result = await service.createProduct(dto);
      expect(result).toEqual(product);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(product);
    });
  });

  describe('updateProduct', () => {
    it('should update and save a product', async () => {
      const dto: ProductDto = {
        user: 5,
        content: [],
      };
      const id = 1;
      const existingProduct = { id, ...dto };
      const updatedProduct = { id, ...dto };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingProduct as any);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedProduct as any);

      const result = await service.updateProduct(dto, id);
      expect(result).toEqual(updatedProduct);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      expect(repository.save).toHaveBeenCalledWith(updatedProduct);
    });
  });

  describe('getAllPolls', () => {
    it('should return an array of products', async () => {
      const products = [{ id: 1 }, { id: 2 }];
      jest.spyOn(repository, 'find').mockResolvedValue(products as any);

      const result = await service.getAllPolls();
      expect(result).toEqual(products);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product by id', async () => {
      const id = 1;
      const deleteResult = { affected: 1 };
      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult as any);

      const result = await service.deleteProduct(id);
      expect(result).toEqual(deleteResult);
      expect(repository.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('deleteAllOrdersByUserId', () => {
    it('should delete all orders by user id', async () => {
      const userId = 1;
      const deleteResult = { affected: 1 };

      const createQueryBuilder: any = {
        delete: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(deleteResult),
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(createQueryBuilder);

      const result = await service.deleteAllOrdersByUserId(userId);
      expect(result).toEqual(deleteResult);
      expect(createQueryBuilder.delete).toHaveBeenCalled();
      expect(createQueryBuilder.from).toHaveBeenCalledWith(Product);
      expect(createQueryBuilder.where).toHaveBeenCalledWith("user = :id", { id: userId });
      expect(createQueryBuilder.execute).toHaveBeenCalled();
    });
  });
});
