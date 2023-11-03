import Popup from "reactjs-popup";
import ColumnSelectionModal from "../../components/ColumnSelectionModal";
import {
    handleColumnSelection,
    handleEndDateChange,
    handleIsOpenPopup,
    handleResetPicker,
    handleStartDateChange
} from "./handlers";
import DataPicker from "../../components/datepicker";
import MixChart from "../../components/charts/Mix";
import React, {useEffect, useRef, useState} from "react";
import Cookies from "js-cookie";
import GetDataFromServer from "../../utils/getDataFromServer";
import downloadImage from "../../utils/saveImage";

export function MixCreate () {

    const SavedChooseGraph = Cookies.get('choose-graph');
    const [selectedLinear, setSelectedLinear] = useState([]);
    const [selectedBar, setSelectedBar] = useState([]);
    const [selectedArea, setSelectedArea] = useState([]);
    const [selectedDimens, setSelectedDimens] = useState([]);
    const [axisX, setAxisX] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [columns, setColumns] = useState([]);
    const [chartSize, setChartSize] = useState({width:100,height:100});
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [DateColumn, setDateColumn] = useState(null);
    const divRef = useRef(null);

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

    return (
        <div className="wrapperForm">
            <div className="tools">
                <div className="parameter">
                    <span>Ось абсцисс</span>
                    <Popup trigger={<input type="text" value={axisX} placeholder="Выберите ось X" readOnly/>} position="right center" closeOnDocumentClick={!isOpen}>
                        <ColumnSelectionModal columns={columns} onSelectColumn={selectedColumn => handleColumnSelection(setAxisX, selectedColumn, true)} setSelection={setAxisX} onClose={(opened) => {handleIsOpenPopup(opened, setIsOpen)}}/>
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
                                    <ColumnSelectionModal columns={columns} onSelectColumn={selectedColumn => handleColumnSelection(setDateColumn, selectedColumn, true)} setSelection={setDateColumn} onClose={(opened) => {handleIsOpenPopup(opened, setIsOpen)}}/>
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
                            <button onClick={() => handleResetPicker(setStartDate, setEndDate, setDateColumn)}>Сбросить</button>
                        </div>
                    </Popup>
                </div>
                <div className="parameter">
                    <span>Линейная диаграмма</span>
                    <Popup trigger={<input type="text" value={selectedLinear.join(', ') || ''} placeholder="Выберите столбец" readOnly/>} position="right center" closeOnDocumentClick={!isOpen}>
                        <ColumnSelectionModal columns={columns} onSelectColumn={selectedColumn => handleColumnSelection(setSelectedLinear, selectedColumn)} setSelection={setSelectedLinear} onClose={(opened) => {handleIsOpenPopup(opened, setIsOpen)}}/>
                    </Popup>
                </div>
                <div className="parameter">
                    <span>Столбчатая диаграмма</span>
                    <Popup trigger={<input type="text" value={selectedBar.join(', ') || ''} placeholder="Выберите столбец" readOnly/>} position="right center" closeOnDocumentClick={!isOpen}>
                        <ColumnSelectionModal columns={columns} onSelectColumn={selectedColumn => handleColumnSelection(setSelectedBar, selectedColumn)} setSelection={setSelectedBar} onClose={(opened) => {handleIsOpenPopup(opened, setIsOpen)}}/>
                    </Popup>
                </div>
                <div className="parameter">
                    <span>Диаграмма площади</span>
                    <Popup trigger={<input type="text" value={selectedArea.join(', ') || ''} placeholder="Выберите столбец" readOnly/>} position="right center" closeOnDocumentClick={!isOpen}>
                        <ColumnSelectionModal columns={columns} onSelectColumn={selectedColumn => handleColumnSelection(setSelectedArea, selectedColumn)} setSelection={setSelectedArea} onClose={(opened) => {handleIsOpenPopup(opened, setIsOpen)}}/>
                    </Popup>
                </div>
                {/*<div className="parameter">*/}
                {/*    <span>Группы данных</span>*/}
                {/*    <Popup trigger={<input type="text" value={selectedDimens.join(', ') || ''} placeholder="Выберите столбец" readOnly/>} position="right center" closeOnDocumentClick={!isOpen}>*/}
                {/*        <ColumnSelectionModal columns={columns} onSelectColumn={column => handleColumnSelection(setSelectedDimens, column)} setSelection={setSelectedDimens} onClose={(opened) => {handleIsOpenPopup(opened, setIsOpen)}}/>*/}
                {/*    </Popup>*/}
                {/*</div>*/}
                <div className='btn-tools'>
                    {/*<button>Сохранить график</button>*/}
                    <button onClick={downloadImage}>Экспорт графика</button>
                </div>
            </div>
            <div className="chart" id="chartContainer" ref={divRef}>
                <MixChart nameDataset={SavedChooseGraph}
                                metricsLinear={selectedLinear}
                                metricsBar={selectedBar}
                                metricsArea={selectedArea}
                                date_start={startDate}
                                date_end={endDate}
                                x = {axisX}
                                date_column={DateColumn}
                                dimensions={selectedDimens}
                                chartSize={chartSize}
                />
            </div>
        </div>
    )
}