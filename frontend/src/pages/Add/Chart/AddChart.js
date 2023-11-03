import React, {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import './AddChart.css'
import Dropdown from "../../../components/Dropdown";

import GetDataFromServer from '../../../utils/getDataFromServer'
import {useNavigate} from "react-router-dom";


export default function AddChart() {

    const SavedChooseGraph = Cookies.get('choose-graph');

    const [ds, setDs] = useState([]);
    const [imgGraph, setImgGraph] = useState(1);
    const [selectedGraph, setSelectedGraph] = useState(1);

    useEffect( () => {
        GetDataFromServer(setDs, '/getDataDropdown/datasets/');
    }, [])

    const ListTypeGraph = () => {
        const [types, setTypes] = useState([]);

        useEffect(() => {
            GetDataFromServer(setTypes, '/getTypesGraph');
        }, [])


        return (
            <ul>
                {types.map( (type) => {
                    const isActive = type.id === selectedGraph ? 'activeType' : '';
                    return <li className={`listGraph ${isActive}`} id={'type_' + type.id} key={type.id} onClick={() => handleGraphClick(type.id)}>{type.typeGraph}</li>
                })}
            </ul>
        )
    }

    const handleOptionSelect = (selectedOption) => {
        console.log(selectedOption)
    };

    const handleGraphClick = (graph) => {
        setImgGraph(graph);
        setSelectedGraph(graph);

    }

    const navigate = useNavigate();

    const handleCreate = () => {
        navigate('/create/chart', { state: { selectedGraph: selectedGraph, ds: ds} });
    };

    return (
        <div className='wrapper'>
            <div className='choiceDataset'>
                <div className="circle"><span className="number">1</span></div>
                <label className="text-addGraph">Выберите датасет для создания графика</label>
                <Dropdown options={ds} onSelect={handleOptionSelect} savedChoose={SavedChooseGraph ? SavedChooseGraph: 'All'}/>
            </div>
            <div className='choiceGraph'>
                <div className="text-choice">
                    <div className="circle"><span className="number">2</span></div>
                    <label className="text-addGraph">Выберите желаемый график</label>
                </div>
                <div className="choiceType">
                    <ListTypeGraph />
                    <div className="vertical-line"></div>
                    <div className="preview-type">
                        <img className="preview" src={process.env.PUBLIC_URL + `/assets/typeGraph/${imgGraph}.png`} alt="Тип графика"></img>
                    </div>
                </div>
            </div>
            <button onClick={handleCreate}>Продолжить</button>
        </div>
    )
}
