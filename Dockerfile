# 1. Usa uma imagem oficial do Node.js estável
FROM node:18-alpine

# 2. Cria a pasta do app dentro do container
WORKDIR /app

# 3. Copia os arquivos de dependências
COPY package*.json ./

# 4. Instala os pacotes
RUN npm install

# 5. Copia o resto dos arquivos do projeto
COPY . .

# 6. Faz o build de produção do Next.js
RUN npm run build

# 7. Informa que o container vai rodar na porta 3000 internamente
EXPOSE 3000

# 8. Comando para ligar o servidor
CMD ["npm", "run", "start"]