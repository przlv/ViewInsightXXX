import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './Graphs.css';

import GetDataFromServer from '../../utils/getDataFromServer'

import Dropdown from '../../components/Dropdown'
import {BsSearch} from "react-icons/bs";
import {AiOutlineStar} from "react-icons/ai";
import {FaArrowsAltV} from "react-icons/fa";

const HandlerTableGraphs = ({params}) => {
    const [favorite, setFavorite] = useState(false)

    const handleStarClick = () => {
        setFavorite(prevFavorite => !prevFavorite);
    };

    return (
        <tr>
            <td onClick={handleStarClick}>
                <AiOutlineStar className={favorite ? "StarFavorite-active":'StarFavorite'}/>
            </td>
            <td>{params.name}</td>
            <td>{params.type}</td>
            <td>{params.dataset}</td>
            <td>{params.lastModify}</td>
        </tr>
    )
}

export default function Graphs() {
    const [types, setType] = useState([]);
    const [datasets, setDataset] = useState([]);
    const [graphsInfo, setGraphsInfo] = useState([]);

    useEffect(() => {
        GetDataFromServer(setType, '/getDataDropdown/typeGraph/');
        GetDataFromServer(setDataset, '/getDataDropdown/datasets/');
        GetDataFromServer(setGraphsInfo, '/getDataGraphs/')
    }, []);

    const handleOptionSelect = (selectedOption) => {
        console.log('Selected option:', selectedOption);
    };

    return (
        <div className="content">
            <div className='topbar'>
                <div className="filters">
                    <div className="filter">
                        <b>Тип графика:</b>
                        <div style={{"display": "flex", "flex-direction":"row"}}>
                            <Dropdown options={types} onSelect={handleOptionSelect}/>
                        </div>
                    </div>
                    <div className="filter">
                        <b>Данные:</b>
                        <div style={{"display": "flex", "flex-direction":"row"}}>
                            <Dropdown options={datasets} onSelect={handleOptionSelect}/>
                        </div>
                    </div>
                    <div className="filter">
                        <div className="search-container">
                            <BsSearch className="search-icon"/>
                            <input type="search" className="search-input" placeholder="Поиск"/>
                        </div>
                    </div>
                </div>
                <div className='button section'>
                    <Link to='add/chart'>
                        <button>Добавить график</button>
                    </Link>
                </div>
            </div>


            <div className="graphs-info">
                <table>
                    <tr>
                        <th width='50px'></th>
                        <th>Название графика <FaArrowsAltV className="arrow-filter" /></th>
                        <th>Тип графика <FaArrowsAltV className="arrow-filter" /></th>
                        <th>Данные <FaArrowsAltV className="arrow-filter" /></th>
                        <th>Последнее изменение <FaArrowsAltV className="arrow-filter" /></th>
                    </tr>
                    {graphsInfo.map((graph) => {
                        return <HandlerTableGraphs key={graph.id} params={graph} />;
                    })}
                </table>
            </div>

        </div>
    )
}