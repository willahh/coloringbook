import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNewsletterDto } from './create-newsletter.dto';
import { Newsletter } from './newsletter.entity';

// Liste de domaines temporaires ou indésirables (à compléter selon vos besoins)
const TEMPORARY_EMAIL_DOMAINS = [
  'mailinator.com',
  'temp-mail.org',
  'guerrillamail.com',
  'throwawaymail.com',
];

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(Newsletter)
    private readonly newsletterRepository: Repository<Newsletter>,
  ) {}

  async subscribe(
    createNewsletterDto: CreateNewsletterDto,
  ): Promise<Newsletter> {
    const { email } = createNewsletterDto;

    // Vérifier si l'email utilise un domaine temporaire/indésirable
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (emailDomain && TEMPORARY_EMAIL_DOMAINS.includes(emailDomain)) {
      throw new NotFoundException(
        'Les adresses email temporaires ne sont pas autorisées.',
      );
    }

    // Vérifier si l'email existe déjà
    const existingSubscription = await this.newsletterRepository.findOneBy({
      email,
    });
    if (existingSubscription) {
      throw new NotFoundException(
        'Cet email est déjà inscrit à la newsletter.',
      );
    }

    // Créer et sauvegarder la nouvelle inscription
    const newsletter = this.newsletterRepository.create({ email });
    return await this.newsletterRepository.save(newsletter);
  }

  async findAll(): Promise<Newsletter[]> {
    return this.newsletterRepository.find();
  }
}
