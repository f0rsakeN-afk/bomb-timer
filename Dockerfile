FROM electronuserland/builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .