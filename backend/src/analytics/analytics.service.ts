import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AnalyticsService {
  private readonly ga4MeasurementId: string;
  private readonly ga4ApiSecret: string;
  private readonly ga4Endpoint: string;

  constructor(private configService: ConfigService) {
    this.ga4MeasurementId =
      this.configService.get<string>('GA4_MEASUREMENT_ID');
    this.ga4ApiSecret = this.configService.get<string>('GA4_API_SECRET');
    this.ga4Endpoint = `https://www.google-analytics.com/mp/collect?measurement_id=${this.ga4MeasurementId}&api_secret=${this.ga4ApiSecret}`;
  }

  async trackEvent(
    clientId: string,
    eventName: string,
    params?: Record<string, any>,
  ) {
    try {
      const response = await axios.post(this.ga4Endpoint, {
        client_id: clientId,
        events: [
          {
            name: eventName,
            params: params || {},
          },
        ],
      });
      return response.data;
    } catch (error) {
      console.error('Error sending event to GA4:', error.message);
      throw error;
    }
  }
}
