import { Injectable } from '@nestjs/common';
import { GnosisPayHttpService } from './gnosispay-http.service';
import { Card, Event } from '../types';

@Injectable()
export class GnosisPayCardService {
  constructor(private readonly gnosisPayHttp: GnosisPayHttpService) {}

  /**
   * Get all cards for the user
   */
  async getCards(token: string): Promise<Card[]> {
    return await this.gnosisPayHttp.getCards(token);
  }

  /**
   * Create a new virtual card
   */
  async createVirtualCard(token: string): Promise<Card> {
    return await this.gnosisPayHttp.createVirtualCard(token);
  }

  /**
   * Activate a card
   */
  async activateCard(token: string, cardId: string): Promise<void> {
    await this.gnosisPayHttp.activateCard(token, cardId);
  }

  /**
   * Freeze a card (temporary block)
   */
  async freezeCard(token: string, cardId: string): Promise<void> {
    await this.gnosisPayHttp.freezeCard(token, cardId);
  }

  /**
   * Unfreeze a card
   */
  async unfreezeCard(token: string, cardId: string): Promise<void> {
    await this.gnosisPayHttp.unfreezeCard(token, cardId);
  }

  /**
   * Report card as lost (permanent block)
   */
  async reportCardLost(token: string, cardId: string): Promise<void> {
    await this.gnosisPayHttp.reportCardLost(token, cardId);
  }

  /**
   * Get all transactions for a specific card
   */
  async getCardTransactions(token: string, cardId: string): Promise<Event[]> {
    return await this.gnosisPayHttp.getCardTransactions(token, { cardTokens: [cardId] });
  }

  /**
   * Get card details by ID
   */
  async getCardById(token: string, cardId: string): Promise<Card> {
    return await this.gnosisPayHttp.getCardById(token, cardId);
  }

  /**
   * Get card status information
   */
  async getCardStatus(token: string, cardId: string): Promise<any> {
    return await this.gnosisPayHttp.getCardStatus(token, cardId);
  }

  /**
   * Report card as stolen (permanent block, replacement will be issued)
   */
  async reportCardStolen(token: string, cardId: string): Promise<void> {
    await this.gnosisPayHttp.reportCardStolen(token, cardId);
  }

  /**
   * Void a virtual card (permanent, cannot be undone)
   */
  async voidCard(token: string, cardId: string): Promise<void> {
    await this.gnosisPayHttp.voidCard(token, cardId);
  }
}
