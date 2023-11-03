import psycopg2

DATABASE_NAME = 'vixDatabase'
USER = 'postgres'
PASSWORD = '6678'
HOST = 'db'
PORT = '5432'

conn = psycopg2.connect(dbname=DATABASE_NAME, user=USER, password=PASSWORD, host=HOST, port=PORT)
cur = conn.cursor()

# Создание таблицы typeGraphs
create_type_graphs_table = """
CREATE TABLE typeGraphs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);
"""

# Создание таблицы datasets
create_datasets_table = """
CREATE TABLE datasets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created TIMESTAMP DEFAULT NOW()
);
"""

try:
    # Открытие курсора и выполнение SQL-запросов
    with conn.cursor() as cur:
        cur.execute(create_type_graphs_table)
        cur.execute(create_datasets_table)
        conn.commit()
        print("Таблицы успешно созданы.")
except Exception as e:
    print("Произошла ошибка:", e)
finally:
    # Закрытие соединения с базой данных
    conn.close()