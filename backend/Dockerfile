# Используем официальный образ Python
FROM python:3.10

# Устанавливаем директорию приложения в контейнере
WORKDIR /backend

# Установите зависимости
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Копируйте исходный код вашего приложения в контейнер
COPY . .

# Запустите ваше приложение
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001", "--reload"]
