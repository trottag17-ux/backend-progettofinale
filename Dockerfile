# Usa l'immagine Node.js come base
FROM node:18

# Crea la cartella di lavoro nel container
WORKDIR /app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia tutto il resto del codice nel container
COPY . .

# 🔧 Imposta la porta che Render si aspetta
ENV PORT=10000
EXPOSE 10000

# Avvia l'app
CMD ["node", "server.js"]