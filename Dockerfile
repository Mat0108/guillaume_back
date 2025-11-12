# Étape 1 : build avec cache npm
FROM node:20-slim AS build

# Répertoire de travail
WORKDIR /app

# Installation des dépendances système (libvips pour sharp)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips libvips-dev \
    && rm -rf /var/lib/apt/lists/*

# Copie uniquement des fichiers de dépendances pour activer le cache Docker
COPY package*.json ./

# Installation des dépendances avec cache
# npm ci est plus rapide et déterministe (si package-lock.json existe)
RUN npm ci --omit=dev || npm install --production

# Copie du code source (cette étape invalide le cache uniquement si le code change)
COPY . .

# Étape finale : runtime léger
FROM node:20-slim

WORKDIR /app

# Même dépendances système nécessaires à sharp
RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips libvips-dev \
    && rm -rf /var/lib/apt/lists/*

# Copie des fichiers depuis l’étape de build
COPY --from=build /app .

# Définit la variable d’environnement pour Node
ENV NODE_ENV=production

# Port exposé
EXPOSE 8080

# Commande de lancement
CMD ["npm", "start"]
