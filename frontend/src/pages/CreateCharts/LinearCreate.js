import Popup from "reactjs-popup";
import ColumnSelectionModal from "../../components/ColumnSelectionModal";
import {
    handleColumnSelection, handleColumnSelectionLine2,
    handleEndDateChange,
    handleIsOpenPopup,
    handleResetPicker,
    handleStartDateChange
} from "./handlers";
import DataPicker from "../../components/datepicker";
import LinearChart from "../../components/charts/Linear";
import React, {useEffect, useRef, useState} from "react";
import Cookies from "js-cookie";
import GetDataFromServer from "../../utils/getDataFromServer";
import downloadImage from "../../utils/saveImage";

export function LinearCreate () {

    const SavedChooseGraph = Cookies.get('choose-graph');
    const [selectedMetrics, setSelectedMetrics] = useState([]);
    const [selectedMetric1, setSelectedMetric1] = useState([]);
    const [selectedMetric2, setSelectedMetric2] = useState([]);
    const [selectedDimens, setSelectedDimens] = useState([]);
    const [axisX, setAxisX] = useState([]);
    const [DateColumn, setDateColumn] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [columns, setColumns] = useState([]);
    const [chartSize, setChartSize] = useState({width:100,height:100});
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const divRef = useRef(null);
    const [aggregateTime, setAggregateTime] = useState(null);
    const [typeLinear, setTypeLinear] = useState('monotone');
    const [isChecked, setIsChecked] = useState(false);
    const columnsTimeAggregate = ['Среднегодовое','Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    const typeLinears = ['basis', 'basisClosed', 'basisOpen', 'bumpX', 'bumpY', 'bump', 'linear', 'linearClosed', 'natural', 'monotoneX', 'monotoneY', 'monotone', 'step', 'stepBefore', 'stepAfter' ]

    useEffect(() => {
            GetDataFromServer(setColumns, `/get/columns/${SavedChooseGraph}`);
            if (divRef.current) {
                let size = {
                    width: divRef.current.offsetWidth,
                    height: divRef.current.offsetHeight
                }
                setChartSize(size)
            }
        },
        [SavedChooseGraph]);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    return (
        <div className="wrapperForm">
            <div className="tools">
                <div className="parameter">
                    <span>Двухосевой график</span>
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                    />
                </div>
                <div className="parameter">
                    <span>Ось абсцисс</span>
                    <Popup trigger={<input type="text" value={axisX} placeholder="Выберите ось X" readOnly/>} position="right center" closeOnDocumentClick={!isOpen}>
                        <ColumnSelectionModal columns={columns} onSelectColumn={selectedColumn => handleColumnSelection(setAxisX, selectedColumn, true)} setSelection={setAxisX} onClose={(opened) => {handleIsOpenPopup(opened, setIsOpen)}}/>
                    </Popup>
                </div>
                <div className="parameter">
                    <span>Усреднение по</span>
                    <Popup trigger={<input type="text" value={aggregateTime} placeholder="Выберите усреднение" readOnly/>} position="right center" closeOnDocumentClick={!isOpen}>
                        <ColumnSelectionModal columns={columnsTimeAggregate} onSelectColumn={selectedColumn => handleColumnSelection(setAggregateTime, selectedColumn, true)} onClose={(opened) => {handleIsOpenPopup(opened, setIsOpen)}}/>
                    </Popup>
                </div>
                <div className="parameter">
                    <span>Временной интервал</span>
                    <Popup trigger={<input type="text" value={startDate !== null ? `${startDate} - ${endDate}` : ''} placeholder="Выберите интервал" readOnly/>} position="right center" closeOnDocumentClick={false}>
                        <div className="datapickers">
                            <div className="parameter">
                                <span>Столбец Даты</span>
                                <Popup trigger={<input type="text" value={DateColumn} placeholder="Выберите столбец с датой" readOnly/>}
                                       position="right center" closeOnDocumentClick={!isOpen}>
                                    <ColumnSelectionModal columns={columns} onSelectColumn={selectedColumn => handleColumnSelection(setDateColumn, selectedColumn, true)} onClose={(opened) => {handleIsOpenPopup(opened, setIsOpen)}}/>
                                </Popup>
                            </div>
                            <div className="datapickers-graph">
                                <span>От:</span>
                                <DataPicker onChange={ selectedDate => { handleStartDateChange(selectedDate, setStartDate) }}/>
                            </div>
                            <div className="datapickers-graph">
                                <span>До:</span>
                                <DataPicker onChange={ selectedDate => { handleEndDateChange(selectedDate, setEndDate) }}/>
                            </div>
                            <button onClick={() => handleResetPicker(setStartDate, setEndDate)}>Сбросить</button>
                        </div>
                    </Popup>
                </div>
                <div className="parameter">
                    <span>Показатели</span>
                    {isChecked ? (
                        <div className="parameter">
                            <span>Показатель №1</span>
                            <Popup trigger={<input type="text" value={selectedMetric1} placeholder="Выберите столбец" readOnly/>} position="right center" closeOnDocumentClick={!isOpen}>
                                <ColumnSelectionModal columns={columns} onSelectColumn={selectedColumn => handleColumnSelection(setSelectedMetric1, selectedColumn, true)} onClose={(opened) => {handleIsOpenPopup(opened, setIsOpen)}}/>
                            </Popup>
                            <span>Показатель №2</span>
                            <Popup trigger={<input type="text" value={selectedMetric2} placeholder="Выберите столбец" readOnly/>} position="right center" closeOnDocumentClick={!isOpen}>
                                <ColumnSelectionModal columns={columns} onSelectColumn={selectedColumn => handleColumnSelection(setSelectedMetric2, selectedColumn, true)} onClose={(opened) => {handleIsOpenPopup(opened, setIsOpen)}}/>
                            </Popup>
                        </div>
                    ) : (
                        <Popup trigger={<input type="text" value={selectedMetrics.join(', ') || ''} placeholder="Выберите столбец" readOnly/>} position="right center" closeOnDocumentClick={!isOpen}>
                            <ColumnSelectionModal columns={columns} onSelectColumn={selectedColumn => handleColumnSelection(setSelectedMetrics, selectedColumn)} onClose={(opened) => {handleIsOpenPopup(opened, setIsOpen)}}/>
                        </Popup>
                    )}
                </div>
                {/*<div className="parameter">*/}
                {/*    <span>Группы данных</span>*/}
                {/*    <Popup trigger={<input type="text" value={selectedDimens.join(', ') || ''} placeholder="Выберите столбец" readOnly/>} position="right center" closeOnDocumentClick={!isOpen}>*/}
                {/*        <ColumnSelectionModal columns={columns} onSelectColumn={column => handleColumnSelection(setSelectedDimens, column)} onClose={(opened) => {handleIsOpenPopup(opened, setIsOpen)}}/>*/}
                {/*    </Popup>*/}
                {/*</div>*/}
                <div className="parameter">
                    <span>Тип Линии</span>
                    <Popup trigger={<input type="text" value={typeLinear} placeholder="Выберите столбец" readOnly/>} position="right center" closeOnDocumentClick={!isOpen}>
                        <ColumnSelectionModal columns={typeLinears} onSelectColumn={column => handleColumnSelection(setTypeLinear, column, true)} onClose={(opened) => {handleIsOpenPopup(opened, setIsOpen)}}/>
                    </Popup>
                </div>
                <div className='btn-tools'>
                    {/*<button>Сохранить график</button>*/}
                    <button onClick={downloadImage}>Экспорт графика</button>
                </div>
            </div>
            <div className="chart" id="chartContainer" ref={divRef}>
                <LinearChart nameDataset={SavedChooseGraph}
                             metrics={isChecked ? [].concat(selectedMetric1, selectedMetric2):selectedMetrics}
                             date_start={startDate}
                             date_end={endDate}
                             x = {axisX}
                             dimensions={selectedDimens}
                             chartSize={chartSize}
                             aggregateTime={aggregateTime}
                             date_column={DateColumn}
                             typeLinear={typeLinear}
                             isChecked={isChecked}
                />
            </div>
        </div>
    )
}