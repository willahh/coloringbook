#!/bin/bash
if [[ -n $(git status -s) ]]; then
    echo "a"
fi



#!/bin/bash

# Vérifier si le répertoire de travail est propre
# if [[ -n $(git status -s) ]]; then
#   echo "Le répertoire de travail n'est pas propre. Veuillez valider ou annuler vos modifications avant de déployer."
#   exit 1
# fi

# # Monter la version du fichier package.json
# npm version patch

# # Récupérer la nouvelle version
# VERSION=$(node -p "require('./package.json').version")

# # Créer un tag git avec la nouvelle version
# git tag -a "v$VERSION" -m "Déploiement de la version $VERSION"

# # Pousser les modifications et les tags vers le dépôt distant
# git push origin main --tags

# # Déployer en production (exemple avec rsync)
# rsync -avz --exclude '.git' ./ user@production-server:/path/to/production

# echo "Déploiement de la version $VERSION terminé avec succès."

# # ...existing code...
