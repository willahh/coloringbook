import { Controller, Post, Body } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('track')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post()
  async track(
    @Body()
    body: {
      client_id: string;
      event_name: string;
      params?: Record<string, any>;
    },
  ) {
    const { client_id, event_name, params } = body;
    if (!client_id || !event_name) {
      return { error: 'Missing required fields: client_id, event_name' };
    }
    await this.analyticsService.trackEvent(client_id, event_name, params);
    return { message: 'Event tracked successfully' };
  }
}
