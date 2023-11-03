import json
from datetime import datetime

from fastapi import APIRouter, Request, UploadFile, HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import sessionmaker
from models.bd import *
import itertools

from src.validators import *

router = APIRouter()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@router.post("/uploadExcel")
async def upload_excel_files(request: Request):
    form = await request.form()
    dataset_name, sheet_name, description, file = form.get('dataset_name'), form.get('sheet_name'), form.get(
        'description'), form.get('file')
    try:
        file_content = await file.read()

        # Сохранение временного файла
        temp_file_path = f"temp/temp_{file.filename}"
        with open(temp_file_path, "wb") as f:
            f.write(file_content)

        success, message = upload_excel_to_postgres(temp_file_path, dataset_name, description, sheet_name)

        return JSONResponse(content={"success": success, "msg": message})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/getDataDropdown/{name}")
async def data_dropdown(request: Request, name: str):
    if name == 'typeGraph':
        options = [
            {'id': 1, 'label': 'All'},
            {'id': 2, 'label': 'Линейная диаграмма'},
            {'id': 3, 'label': 'Столбчатая диаграмма'},
            {'id': 4, 'label': 'Круговая диаграмма'},
            {'id': 5, 'label': 'Полярная область'},
            {'id': 6, 'label': 'Смешанная диаграмма'},
            {'id': 7, 'label': 'Пузырьковая диаграмма'},
            {'id': 8, 'label': 'Радарная диаграмма'},
            {'id': 9, 'label': 'Диаграмма рассеяния'},
            {'id': 10, 'label': 'Коррелограмма с диаграммой рассеяния и гистограммой'},
        ]
        return JSONResponse(content=options)
    else:
        try:
            with Session(engine) as db:
                datasets = db.query(Datasets).all()
        except Exception as e:
            return False, str(e)

        if not datasets:
            return {'msg': 'Dataset not found'},

        data = []
        for num, dataset in enumerate(datasets):
            data.append(
                {'id': num, 'label': dataset.name},
            )

        return JSONResponse(content=data)


@router.get("/getDataGraphs")
async def data_graphs(request: Request):
    options = [
        {'id': 1, 'name': 'Гистограмма цветность', 'type': 'Линейная диаграмма', 'dataset': 'dataload_21_09',
         'lastModify': '03.12.2023'},
        {'id': 2, 'name': 'Линейный график для водозабора', 'type': 'Круговая диаграмма', 'dataset': 'dataload_23_07',
         'lastModify': '15.09.2023'},
        {'id': 3, 'name': 'Столбчатая диаграмма для показателей', 'type': 'Столбчатая диаграмма',
         'dataset': 'dataload_21_08',
         'lastModify': '28.11.2023'},
    ]

    return JSONResponse(content=options)


@router.get("/getDataDatasets")
async def data_ds(request: Request):
    try:
        with Session(engine) as db:
            datasets = db.query(Datasets).all()
    except Exception as e:
        return False, str(e)

    if not datasets:
        return {'msg': 'Dataset not found'},

    data = []
    for num, dataset in enumerate(datasets):
        data.append(
            {'id': num, 'name': dataset.name, 'description': dataset.description, 'createTime': str(dataset.created)},
        )

    return JSONResponse(content=data)


@router.get("/getTypesGraph")
async def get_type_graph(request: Request):
    options = ['Линейная диаграмма', 'Столбчатая диаграмма', 'Круговая диаграмма', 'Полярная область',
               'Смешанная диаграмма', 'Пузырьковая диаграмма', 'Радарная диаграмма', 'Диаграмма рассеяния',
               'Коррелограмма с диаграммой рассеяния и гистограммой']

    options = [
        {'id': 1, 'typeGraph': 'Линейная диаграмма'},
        {'id': 2, 'typeGraph': 'Столбчатая диаграмма'},
        {'id': 3, 'typeGraph': 'Круговая диаграмма'},
        # {'id': 4, 'typeGraph': 'Полярная область'},
        {'id': 5, 'typeGraph': 'Смешанная диаграмма'},
        # {'id': 6, 'typeGraph': 'Пузырьковая диаграмма'},
        {'id': 7, 'typeGraph': 'Радарная диаграмма'},
        {'id': 8, 'typeGraph': 'Диаграмма рассеяния'},
        {'id': 9, 'typeGraph': 'Коррелограмма с диаграммой рассеяния и гистограммой'},
    ]

    return JSONResponse(content=options)


@router.get('/get/columns/{table_name}')
async def get_column_in_ds(request: Request, table_name: str):
    db = SessionLocal()
    query = f"SELECT column_name FROM information_schema.columns WHERE table_name = '{table_name}'"
    resultQuery = db.execute(query).fetchall()
    db.close()

    columns = [row[0] for row in resultQuery]

    return JSONResponse(content=columns)


@router.post('/get/dataGraph/linear/{table_name}')
async def get_linear_data(request: Request, table_name: str):
    db = SessionLocal()
    query = f'SELECT * FROM {table_name}'
    body_data = await request.json()
    resultQuery = db.execute(query)
    df = pd.DataFrame(resultQuery.fetchall(), columns=resultQuery.keys())
    db.close()

    data = []
    dataTrue = False

    if body_data['aggregateTime'] and body_data['x']:
        month = month_in_num(body_data['aggregateTime'])
        if month:
            list_del = []
            for index, value in enumerate(df[body_data['x']]):
                if not value.month == month:
                    list_del.append(index)
            df.drop(index=list_del, inplace=True)
        elif body_data['aggregateTime'] == 'Среднегодовое':
            df['year'] = df[body_data['x']].dt.year
            df = df.groupby('year').mean()
            df[body_data['x']] = df[body_data['x']].dt.strftime('%Y')
            dataTrue = True

    if body_data['date_column']:
        if body_data['date_start']:
            start_date = pd.to_datetime(body_data['date_start'])
            df = df[df[body_data['date_column']] >= start_date]
        if body_data['date_end']:
            end_date = pd.to_datetime(body_data['date_end'])
            df = df[df[body_data['date_column']] <= end_date]

    for index, row in enumerate(df.iterrows()):
        if is_valid_date(row[1][body_data['x']]) or dataTrue:
            x_axis = str(row[1][body_data['x']]).split('T')[0].split(' ')[0]
        else:
            x_axis = index
        temp_data = {'x': x_axis}
        for column, value in row[1].items():
            if column == body_data['x']:
                continue
            if not is_numeric(df[column]):
                continue
            temp_data[column] = round(value, 3)

        data.append(temp_data)

    return JSONResponse(data)


@router.post('/get/dataGraph/bar/{table_name}')
async def get_bar_data(request: Request, table_name: str):
    db = SessionLocal()
    query = f'SELECT * FROM {table_name}'
    body_data = await request.json()
    resultQuery = db.execute(query).fetchall()
    db.close()

    column_names = list(resultQuery[0].keys())
    if body_data['x']:
        column_names.remove(body_data['x'])

    data = []
    for index, row in enumerate(resultQuery):
        if body_data['x']:
            if is_valid_date(row[body_data['x']]):
                date_current = row[body_data['x']]

                if body_data['date_start']:
                    date_start = datetime.strptime(body_data['date_start'], "%d/%m/%Y")
                    if not date_start <= date_current:
                        continue

                if body_data['date_end']:
                    date_end = datetime.strptime(body_data['date_end'], "%d/%m/%Y")
                    if not date_current <= date_end:
                        continue

                date_string = date_current.strftime("%d-%m-%Y")
                obj = {'x': date_string}
            else:
                obj = {'x': round(row[body_data['x']])}
        else:
            obj = {'x': index}

        for column in column_names:
            if not column in body_data['metrics']:
                continue
            obj[column] = round(row[column], 3)
        data.append(obj)

    return JSONResponse(data)


@router.post('/get/dataGraph/pie/{table_name}')
async def get_pie_data(request: Request, table_name: str):
    db = SessionLocal()
    query = f'SELECT * FROM {table_name}'
    body_data = await request.json()
    resultQuery = db.execute(query)
    df = pd.DataFrame(resultQuery.fetchall(), columns=resultQuery.keys())
    db.close()

    data = []

    if body_data['date_column']:
        if body_data['date_start']:
            start_date = pd.to_datetime(body_data['date_start'])
            df = df[df[body_data['date_column']] >= start_date]
        if body_data['date_end']:
            end_date = pd.to_datetime(body_data['date_end'])
            df = df[df[body_data['date_column']] <= end_date]

    aggregateFunc = body_data['aggregateFunc']
    for column in body_data['metrics']:
        if column == body_data['date_column']:
            continue

        if not is_numeric(df[column]):
            continue

        obj = {'name': column}
        if aggregateFunc == 'AVG':
            obj['value'] = round(df[column].mean())
        if aggregateFunc == 'SUM':
            obj['value'] = round(df[column].sum())
        if aggregateFunc == 'MAX':
            obj['value'] = round(df[column].max())
        if aggregateFunc == 'MIN':
            obj['value'] = round(df[column].min())
        data.append(obj)

    return JSONResponse(data)


@router.post('/get/dataGraph/radar/{table_name}')
async def get_radar_data(request: Request, table_name: str):
    db = SessionLocal()
    query = f'SELECT * FROM {table_name}'
    body_data = await request.json()
    resultQuery = db.execute(query)
    df = pd.DataFrame(resultQuery.fetchall(), columns=resultQuery.keys())
    db.close()

    data = []

    if body_data['date_column']:
        if body_data['date_start']:
            start_date = pd.to_datetime(body_data['date_start'])
            df = df[df[body_data['date_column']] >= start_date]
        if body_data['date_end']:
            end_date = pd.to_datetime(body_data['date_end'])
            df = df[df[body_data['date_column']] <= end_date]

    aggregateFunc = body_data['aggregateFunc']
    for column in body_data['metrics']:
        if column == body_data['date_column']:
            continue

        if not is_numeric(df[column]):
            continue

        obj = {'subject': column}
        if aggregateFunc == 'AVG':
            obj['value'] = round(df[column].mean())
        if aggregateFunc == 'SUM':
            obj['value'] = round(df[column].sum())
        if aggregateFunc == 'MAX':
            obj['value'] = round(df[column].max())
        if aggregateFunc == 'MIN':
            obj['value'] = round(df[column].min())
        data.append(obj)

    return JSONResponse(data)


@router.post('/get/dataGraph/scatter/{table_name}')
async def get_scatter_data(request: Request, table_name: str):
    db = SessionLocal()
    query = f'SELECT * FROM {table_name}'
    body_data = await request.json()
    resultQuery = db.execute(query)
    df = pd.DataFrame(resultQuery.fetchall(), columns=resultQuery.keys())
    db.close()

    data = []

    if body_data['date_column']:
        if body_data['date_start']:
            start_date = pd.to_datetime(body_data['date_start'])
            df = df[df[body_data['date_column']] >= start_date]
        if body_data['date_end']:
            end_date = pd.to_datetime(body_data['date_end'])
            df = df[df[body_data['date_column']] <= end_date]

    for column in body_data['metrics']:
        if column == body_data['x']:
            continue

        if not is_numeric(df[column]):
            continue

        dataScatter = []
        for value_x, value_y in zip(df[body_data['x']].values, df[column].values):
            date_str = str(value_x).split('T')[0]
            dataScatter.append({
                'x': date_str,
                'y': value_y
            })
        data.append(dataScatter)

    # Возвращаем данные в формате JSON
    return JSONResponse(data)


@router.post('/get/dataGraph/matrixScatter/{table_name}')
async def get_matrix_scatter_data(request: Request, table_name: str):
    db = SessionLocal()
    query = f'SELECT * FROM {table_name}'
    body_data = await request.json()
    resultQuery = db.execute(query)
    df = pd.DataFrame(resultQuery.fetchall(), columns=resultQuery.keys())
    db.close()

    data = {}

    if body_data['date_column']:
        if body_data['date_start']:
            start_date = pd.to_datetime(body_data['date_start'])
            df = df[df[body_data['date_column']] >= start_date]
        if body_data['date_end']:
            end_date = pd.to_datetime(body_data['date_end'])
            df = df[df[body_data['date_column']] <= end_date]

    numeric_columns = [column for column in body_data['metrics'] if is_numeric(df[column])]

    # Создайте комбинации колонок x и y из числовых колонок
    combinations = list(itertools.product(numeric_columns, repeat=2))

    # Переберите все комбинации и создайте данные для каждой
    for combination in combinations:
        x_column, y_column = combination
        dataScatter = []

        for value_x, value_y in zip(df[x_column].values, df[y_column].values):
            date_str = str(value_x).split('T')[0]
            dataScatter.append({
                'x': date_str,
                'y': value_y
            })

        data[f'{x_column}-{y_column}'] = dataScatter

    # Возвращаем данные в формате JSON
    return JSONResponse(data)


@router.post('/get/dataGraph/mixchart/{table_name}')
async def get_mix_data(request: Request, table_name: str):
    db = SessionLocal()
    query = f'SELECT * FROM {table_name}'
    body_data = await request.json()
    resultQuery = db.execute(query)
    df = pd.DataFrame(resultQuery.fetchall(), columns=resultQuery.keys())
    db.close()

    data = []

    if body_data['date_column']:
        if body_data['date_start']:
            start_date = pd.to_datetime(body_data['date_start'])
            df = df[df[body_data['date_column']] >= start_date]
        if body_data['date_end']:
            end_date = pd.to_datetime(body_data['date_end'])
            df = df[df[body_data['date_column']] <= end_date]

    mixColumns = body_data['metricsLinear'] + body_data['metricsBar'] + body_data['metricsArea']

    for index, row in df.iterrows():
        regular_object = {}
        for column, value in row.items():

            if body_data['x']:
                if column == body_data['x']:
                    date_str = str(value).split('T')[0]
                    regular_object['x'] = date_str.split(' ')[0]
                    continue
            else:
                regular_object['x'] = index

            if not (column in mixColumns):
                continue

            if not is_numeric(df[column]):
                continue

            regular_object[column] = value
        data.append(regular_object)

    # Возвращаем данные в формате JSON
    return JSONResponse(data)
