import { Controller, Get, Post, Patch, Body, Param, Inject, ParseUUIDPipe,
        Query } from '@nestjs/common';
import { CreateOrderDto, FilterOrderDto, OrderStatusDto } from './dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send({cmd: 'create_order'}, createOrderDto);
  }

  @Get()
  async findAllOrders(@Query() filterOrderDto: FilterOrderDto) {
    try{
      const orders = await firstValueFrom(
        this.client.send({cmd: 'find_all_orders'}, filterOrderDto)
      );

      return orders;

    }
    catch(error){
       throw new RpcException(error);
    }
     
  }

  @Get('id/:id')
  async findOneOrder(@Param('id', ParseUUIDPipe) id: string) {

    try{
        const order = await firstValueFrom(
          this.client.send({cmd: 'find_one_order'},{ id }) 
        );

        return order;
    }
    catch(error){
      throw new  RpcException(error);
    }

  }
 
  @Get(":status")
  async findAllOrdersByStatus(
    @Param() orderStatusDto: OrderStatusDto,
    @Query() paginationDto: PaginationDto
  ){

    try{

      return this.client.send({cmd: 'find_all_orders'},{
        ...paginationDto,
        status: orderStatusDto.status
      });

    }
    catch(error){
        throw new RpcException(error);
    }

  }

  @Patch(":id")
  async changeOrderStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() orderStatusDto: OrderStatusDto
  ){
    try{
        const orderStatus = await firstValueFrom(
          this.client.send({ cmd: "change_order_status"},{
            id,
            status: orderStatusDto.status
          })
        );

        return orderStatus;
    }
    catch(error){
      throw new RpcException(error);
    }
  }


}
