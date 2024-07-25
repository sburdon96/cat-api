import { Injectable, NotFoundException } from '@nestjs/common';
import { NextDeliveryResponse } from '../models/responses.model';
import * as fs from 'fs';
import * as path from 'path';
import { User } from '../models/user.model';
import { Cat, PouchSizeCost } from '../models/cat.model';

@Injectable()
export class CommsService {
  private userData: User[];

  constructor() {
    const filePath = path.join(process.cwd(), 'data.json');
    this.userData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  getNextDelivery(userId: string): NextDeliveryResponse {
    const user = this.userData.find((u) => u.id === userId); // Would usually have a db layer but seems overkill for a json file.
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.mapUserNextDelivery(user);
  }

  private mapUserNextDelivery(user: User): NextDeliveryResponse {
    const catsNames = this.listCatNames(user.cats);
    const totalPrice = this.calculateTotalPrice(user.cats);
    const freeGift = this.freeGiftEligible(totalPrice);

    return {
      title: `Your next delivery for ${catsNames}`,
      message: `Hey, ${user.firstName}! In two days' time, we'll be charging you for your next order for ${catsNames}'s fresh food`,
      totalPrice: totalPrice,
      freeGift: freeGift,
    };
  }

  private listCatNames(cats: Cat[]): string {
    const catNames = cats.map((c) => c.name);
    const length = catNames.length;

    switch (length) {
      case 0:
        return 'your cat';
      case 1:
        return catNames[0];
      case 2:
        return `${catNames[0]} and ${catNames[1]}`;
      default:
        const allButLast = catNames.slice(0, length - 1).join(', ');
        const last = catNames[length - 1];
        return `${allButLast}, and ${last}`;
    }
  }

  private calculateTotalPrice(cats: Cat[]): number {
    return cats.reduce((totalCost, cat) => {
      if (cat.subscriptionActive) {
        return totalCost + PouchSizeCost[cat.pouchSize];
      }

      return totalCost;
    }, 0);
  }

  private freeGiftEligible(totalPrice: number): boolean {
    return totalPrice > 120;
  }
}
