import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { CreateNewsletterDto } from './create-newsletter.dto';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  async subscribe(
    @Body(new ValidationPipe()) createNewsletterDto: CreateNewsletterDto,
  ) {
    return this.newsletterService.subscribe(createNewsletterDto);
  }
}
