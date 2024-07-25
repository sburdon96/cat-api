import { Controller, Get, Param } from '@nestjs/common';
import { CommsService } from '../services/comms.service';
import { NextDeliveryResponse } from '../models/responses.model';

@Controller('comms')
export class CommsController {
  constructor(private readonly appService: CommsService) {}

  @Get('your-next-delivery/:userId')
  getNextDelivery(@Param('userId') userId: string): NextDeliveryResponse {
    return this.appService.getNextDelivery(userId);
  }
}
