import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ProductService } from './commandes.service';
import { ProductDto } from './commandes.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createProduct(@Body() dto: ProductDto) {
    return this.productService.createProduct(dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  updateProduct(@Body() dto: ProductDto, @Param('id') id: number) {
    return this.productService.updateProduct(dto, id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }

  @Get()
  getAllProducts() {
    return this.productService.getAllPolls();
  }
}
