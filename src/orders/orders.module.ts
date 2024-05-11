import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { NatsModule } from 'src/nats/nats.module';

@Module({
  controllers: [OrdersController],
  providers: [],
  imports: [NatsModule]
  //imports:[
    //ClientsModule.register([
      //{
        //name: ORDER_SERVICE,
        //transport: Transport.TCP,
        //options: {
          //host: envs.ordersMicroserviceHost,
          //port: envs.ordersMicroservicePort
        //}

      //}
    //])
    
  
  //]
})
export class OrdersModule {}
