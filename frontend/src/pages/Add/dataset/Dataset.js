import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import './Dataset.css'

import config from '../../../config.json'

export default function AddDataset() {

    const [datasetName, setDatasetName] = useState('');
    const [list, setList] = useState('');
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleRedirect = (path) => {
        navigate(path);
    }

    const handleDatasetNameChange = (event) => {
        setDatasetName(event.target.value);
    }

    const handleListChange = (event) => {
        setList(event.target.value);
    }

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    }

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value)
    }

    const handleLoadDataset = () => {

        // Создайте объект FormData для отправки данных на сервер
        const formData = new FormData();
        formData.append('dataset_name', datasetName);
        formData.append('sheet_name', list);
        formData.append('description', description);
        formData.append('file', file);

        // Здесь можно использовать fetch или другой метод для отправки данных на сервер
        fetch(config.server+'/uploadExcel', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(() => {
            })
            .catch(error => {
                console.error(error)
            });
        handleRedirect('/dataview');
    }


    return (
        <div className="wrapper">
            <div className="title-page">
                <span className="title-text">Загрузка данных</span>
                <div className="horizontalLine"></div>
            </div>

            <div className="load-page">
                <div className="item-load">
                    <span className="text-load">Наименование датасета</span>
                    <input className="input-load" type="text" value={datasetName} onChange={handleDatasetNameChange} required={true}></input>
                </div>
                <div className="item-load">
                    <span className="text-load">Лист</span>
                    <input className="input-load" type="text" value={list} onChange={handleListChange} required={true}></input>
                </div>
                <div className="item-load">
                    <span className="text-load">Описание датасета</span>
                    <input className="input-load" type="text" value={description} onChange={handleDescriptionChange} required={true}></input>
                </div>
                <div className="item-load">
                    <span className="text-load">Файл</span>
                    <label htmlFor="fileInput" className="custom-file-input">
                        Загрузить файл
                        <input type="file" id="fileInput" onChange={handleFileChange}></input>
                    </label>
                    <div id="selectedFile">{file && file.name}</div>
                </div>
                <button onClick={handleLoadDataset}>Продолжить</button>
            </div>
        </div>
    )
}

