import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import './DataView.css';

import {BsSearch} from "react-icons/bs";
import {BsDatabase} from "react-icons/bs";
import {FaArrowsAltV} from "react-icons/fa";

import GetDataFromServer from '../../utils/getDataFromServer'
import {Link} from "react-router-dom";


const HandlerTableDataset = ({params}) => {
    const navigate = useNavigate();
    const handleElementClick = () => {
        Cookies.set('choose-graph', params.name);
        navigate('/add/chart');
    }

    return (
        <tr className="element-ds" onClick={handleElementClick}>
            <td>
                <BsDatabase className='icon-dataset' />
            </td>
            <td>{params.name}</td>
            <td>{params.description}</td>
            <td>{params.createTime}</td>
        </tr>
    )
}

export default function DataView() {
    const [datasets, setDatasets] = useState([]);

    useEffect(() => {
        GetDataFromServer(setDatasets, '/getDataDatasets/');
    }, []);

    return (
        <div className="content">
            <div className="filters">
                <div className="filter">
                    <div className="search-container">
                        <BsSearch className="search-icon"/>
                        <input type="search" className="search-input" placeholder="Поиск"/>
                    </div>
                </div>
                <div className='button section'>
                    <Link to='add/dataset'>
                        <button>Добавить датасет</button>
                    </Link>
                </div>
            </div>

            <div className="datasets-info">
                <table>
                    <tr>
                        <th width='50px'></th>
                        <th>Название датасета <FaArrowsAltV className="arrow-filter" /></th>
                        <th>Описание</th>
                        <th>Дата загрузки <FaArrowsAltV className="arrow-filter" /></th>
                    </tr>
                    {datasets.map((graph) => {
                        return <HandlerTableDataset key={graph.id} params={graph} />;
                    })}
                </table>
            </div>
        </div>
    )
}
