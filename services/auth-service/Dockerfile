# Use a imagem oficial do Node.js como base
FROM node:18

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie o package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie todo o código da aplicação para o diretório de trabalho
COPY . .

# Exponha a porta que o serviço vai utilizar
EXPOSE 5000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
