from datetime import datetime
import pandas as pd


def is_valid_date(date_str, format="%d/%m/%Y"):
    if isinstance(date_str, datetime):
        date_str = date_str.strftime(format)
    if isinstance(date_str, str):
        try:
            datetime.strptime(date_str, format)
            return True
        except ValueError:
            return False
    else:
        return False


def is_numeric(series):
    # Преобразовать столбец в числа с возможностью преобразования ошибок в NaN
    if series.dtypes == int or series.dtypes == float:
        return True
    else:
        return False


def month_in_num(month):
    dict_month = {
        'Январь': 1,
        'Февраль': 2,
        'Март': 3,
        'Апрель': 4,
        'Май': 5,
        'Июнь': 6,
        'Июль': 7,
        'Август': 8,
        'Сентябрь': 9,
        'Октябрь': 10,
        'Ноябрь': 11,
        'Декабрь': 12,
    }
    if month in dict_month:
        return dict_month[month]
    else:
        return False
