import { Body, Controller, Delete, Get, Param, Patch, Post, Inject, Query, ParseIntPipe } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from "rxjs";
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  createProduct( @Body() createProductDto: CreateProductDto){
    return this.client.send({ cmd: "create_product" }, createProductDto)
  }

  @Get()
  findAllProducts( @Query() paginationDto: PaginationDto){
    return this.client.send({ cmd: "find_all_products" }, paginationDto);
  }

  @Get(":id")
  async findOneProduct(@Param("id") id: string){

    try{
      
      const product = await firstValueFrom(
        this.client.send({ cmd: "find_one_product" }, { id })
      );

      return product;

    }
    catch(error){
      throw new RpcException(error);
    }
    
  }

  @Delete(":id")
  async deleteProduct(@Param("id") id: string){

    try{
        const product = await firstValueFrom(
          this.client.send({ cmd: "delete_product" }, { id })
        );

        return product;
    }
    catch(error){
      throw new RpcException(error);
    }

  }

  @Patch(":id")
  async patchProduct(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto){

      try{
          const product = await firstValueFrom(      
             this.client.send({ cmd: "update_product" }, {
              id,
              ...updateProductDto
            })
        );

        return product;

      }
      catch(error){
        throw new RpcException(error);
      }

  }
  
}
