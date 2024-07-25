import { Test, TestingModule } from '@nestjs/testing';
import { CommsService } from './comms.service';
import { NextDeliveryResponse } from '../models/responses.model';
import { CommsController } from '../controllers/comms.controller';
import { NotFoundException } from '@nestjs/common';

describe('CommsService', () => {
  let sut: CommsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CommsController],
      providers: [CommsService],
    }).compile();

    sut = app.get<CommsService>(CommsService);
  });

  describe('getNextDelivery', () => {
    const validUserId = '618f4ed6-1c5b-4993-a149-f64700bf31dd';
    it('should return the next delivery for a valid user', () => {
      const result: NextDeliveryResponse = sut.getNextDelivery(validUserId);

      expect(result).toEqual({
        title: 'Your next delivery for Betsy',
        message:
          "Hey, Cordell! In two days' time, we'll be charging you for your next order for Betsy's fresh food",
        totalPrice: 69.0,
        freeGift: false,
      });
    });

    it('should throw NotFoundException for an invalid user', () => {
      const userId = 'invalidUserId';
      expect(() => sut.getNextDelivery(userId)).toThrow(NotFoundException);
    });
  });

  describe('calculateTotalPrice', () => {
    it('should calculate the total price for active subscriptions', () => {
      const cats = [
        { name: 'Betsy', pouchSize: 'E', subscriptionActive: true },
        {
          name: 'Christina',
          pouchSize: 'D',
          subscriptionActive: true,
        },
      ];

      const totalPrice = (sut as any).calculateTotalPrice(cats);
      expect(totalPrice).toBe(69.0 + 66.0);
    });

    it('should return 0 if no active subscriptions', () => {
      const cats = [
        {
          name: 'Betsy',
          pouchSize: 'E',
          subscriptionActive: false,
        },
      ];

      const totalPrice = (sut as any).calculateTotalPrice(cats);
      expect(totalPrice).toBe(0);
    });
  });

  // Ran out of time but would continue for free gift eligible and cat names
});
