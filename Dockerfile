# Etapa 1: Usando a imagem base do Node.js 20.11 Alpine
FROM node:20.11-alpine AS build

# Definindo o diretório de trabalho dentro do container
WORKDIR /app

# Copiar o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Antes de rodar o npm install, instale as dependências necessárias
RUN apk add --no-cache python3 make g++

# Instalando as dependências do projeto
RUN npm install

# Copiar os arquivos do projeto para dentro do container
COPY . .

# Compilando o código TypeScript
RUN npm run build

# Etapa 2: Configurando a imagem final
FROM node:20.11-alpine

# Definindo o diretório de trabalho
WORKDIR /app

# Copiar as dependências instaladas e o código compilado do container de build
COPY --from=build /app /app

# Expondo a porta que o servidor irá rodar
EXPOSE 3000

# Comando para rodar o servidor
CMD ["npm", "start"]
