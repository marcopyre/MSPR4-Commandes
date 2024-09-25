import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './commandes.service';
import { OrderDto } from './commandes.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createOrder(@Body() dto: OrderDto) {
    return this.orderService.createOrder(dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  updateOrder(@Body() dto: OrderDto, @Param('id') id: number) {
    return this.orderService.updateOrder(dto, id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteOrder(@Param('id') id: number) {
    return this.orderService.deleteOrder(id);
  }

  @Get()
  getAllOrders() {
    return this.orderService.getAllPolls();
  }
}
