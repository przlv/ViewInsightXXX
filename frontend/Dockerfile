# Используйте официальный образ Node.js в качестве базового образа
FROM node:18 AS build-stage

# Установите рабочую директорию
WORKDIR /app

# Скопируйте файлы package.json и package-lock.json
COPY package*.json ./

# Установите зависимости
RUN npm install

# Копируйте все файлы из текущего каталога в контейнер
COPY . .

# Соберите приложение React
RUN npm run build

# Этап раздачи статических файлов
FROM node:18

# Установите глобально serve
RUN npm install -g serve

# Копируйте собранный frontend из предыдущего этапа
WORKDIR /app
COPY --from=build-stage /app/build /app/build

# Экспонируйте порт 3000
EXPOSE 3000

# Запустите serve для раздачи статических файлов
CMD ["serve", "-s", "build", "-l", "3000"]
