# Dockerfile - frontend
FROM node:18

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Installer 'serve' pour servir l'app en prod
RUN npm install -g serve

# Copier le reste des fichiers de l'app
COPY . .

# Build de l'application pour la production
RUN npm run build

# Exposer le port utilisé par 'serve'
EXPOSE 3000

CMD ["npx", "serve", "-s", "build", "--single", "-l", "3000"]

