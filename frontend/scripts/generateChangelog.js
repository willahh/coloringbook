import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire courant avec ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

// Charger package.json dynamiquement avec l'attribut 'with'
const { default: packageJson } = await import('../package.json', { with: { type: 'json' } });
const { version, buildDate } = packageJson;

const changelogPath = join(__dirname, '../CHANGELOG.md');

// Formatter la date de build
const formattedBuildDate = new Date(buildDate).toLocaleDateString('fr-FR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

// Récupérer tous les commits depuis le début (on filtrera ensuite)
const allCommits = execSync('git log --pretty=format:"%h %s"').toString().split('\n');

// Lire le contenu existant de CHANGELOG.md (s'il existe)
let existingContent = '';
try {
  existingContent = readFileSync(changelogPath, 'utf8');
} catch (error) {
  console.log('Aucun CHANGELOG.md existant trouvé, création d’un nouveau.');
}

// Extraire les hashes des commits déjà dans le changelog
const existingCommitHashes = new Set(
  existingContent.match(/[0-9a-f]{7}/g) || []
);

// Filtrer les nouveaux commits non présents dans le changelog
const newCommits = allCommits
  .filter((commit) => {
    const [hash] = commit.split(' ');
    return !existingCommitHashes.has(hash);
  })
  .map((commit) => `* ${commit}`) // Ajouter le préfixe '*'
  .join('\n');

// Générer la nouvelle section pour cette version (si nouveaux commits)
let newSection = '';
if (newCommits) {
  newSection = `## Version ${version} - ${formattedBuildDate}\n\n${newCommits}\n`;
} else {
  console.log('Aucun nouveau commit à ajouter pour cette version.');
}

// Si pas de nouveaux commits et la version existe déjà, ne rien faire
const versionHeader = `## Version ${version}`;
if (!newSection && existingContent.includes(versionHeader)) {
  console.log(`La version ${version} est déjà à jour, rien à ajouter.`);
  process.exit(0);
}

// Mettre à jour le changelog
if (existingContent.includes(versionHeader)) {
  console.log(`Mise à jour de la section existante pour la version ${version}.`);
  const regex = new RegExp(`## Version ${version}.*?(?=## Version|$)`, 's');
  existingContent = existingContent.replace(regex, newSection);
} else {
  console.log(`Ajout d’une nouvelle section pour la version ${version}.`);
  existingContent = existingContent.replace(
    '# Changelog\n',
    `# Changelog\n\n${newSection}`
  ) || `# Changelog\n\n${newSection}`;
}

// Écrire le contenu mis à jour dans CHANGELOG.md
writeFileSync(changelogPath, existingContent, 'utf8');

console.log('Changelog mis à jour avec succès dans CHANGELOG.md');