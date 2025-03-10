import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { type } from 'os';
import { join } from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire courant avec ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

// Charger package.json dynamiquement avec import()
const packageJson = await import('../package.json', {
    with: {type: 'json'}
});
const { version, buildDate } = packageJson.default;

const changelogPath = join(__dirname, '../CHANGELOG.md');

// Formatter la date de build
const formattedBuildDate = new Date(buildDate).toLocaleDateString('fr-FR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

// Récupérer les commits
const gitLog = execSync('git log --pretty=format:"* %h %s" -n 50').toString();

// Générer le contenu du changelog
const changelogContent = `# Changelog\n\n## Version ${version} - ${formattedBuildDate}\n\n${gitLog}\n`;

// Écrire dans CHANGELOG.md
writeFileSync(changelogPath, changelogContent, 'utf8');

console.log('Changelog généré avec succès dans public/CHANGELOG.md');
