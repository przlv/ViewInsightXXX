from config import *
import pandas as pd
from sqlalchemy import create_engine
from models.models import *
from sqlalchemy.orm import Session

DATABASE_URL = f"postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DATABASE_NAME}"
engine = create_engine(DATABASE_URL, connect_args={"options": "-c client_encoding=utf8"})


def upload_excel_to_postgres(file_path, table_name, description, sheet_name):
    try:
        # Чтение данных из Excel файла
        if sheet_name:
            df = pd.read_excel(file_path, sheet_name)
        else:
            df = pd.read_excel(file_path)

        # Запись данных в PostgreSQL
        df.to_sql(table_name, engine, if_exists='replace', index=False)
        add_new_dataset(table_name, description)
        return True, f"Данные из {file_path} успешно загружены в таблицу {table_name}."
    except Exception as e:
        return False, f"Произошла ошибка: {e}"


def add_new_dataset(table_name: str, description: str = ''):
    try:
        with Session(engine) as db:
            # Создаем новую запись в таблице Datasets
            new_dataset = Datasets(name=table_name, description=description)
            db.add(new_dataset)
            db.commit()

            return True, None
    except Exception as e:
        return False, str(e)
