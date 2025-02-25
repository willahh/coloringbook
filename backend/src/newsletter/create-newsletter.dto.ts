import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  IsString,
  Matches,
} from 'class-validator';

// Regex pour un format d'email strict (exclut certains caractères spéciaux non standards)
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export class CreateNewsletterDto {
  @IsNotEmpty({ message: 'L’email ne peut pas être vide.' })
  @IsString({ message: 'L’email doit être une chaîne de caractères.' })
  @IsEmail({}, { message: 'L’email doit être une adresse email valide.' })
  @MaxLength(255, { message: 'L’email ne doit pas dépasser 255 caractères.' })
  @Matches(EMAIL_REGEX, {
    message:
      'L’email contient des caractères invalides ou un format non autorisé.',
  })
  email: string;
}
