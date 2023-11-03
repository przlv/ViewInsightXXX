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
import MatrixScatterChart from "../../components/charts/MatrixScatter";
import React, {useEffect, useRef, useState} from "react";
import Cookies from "js-cookie";
import GetDataFromServer from "../../utils/getDataFromServer";
import downloadImage from "../../utils/saveImage";

export function MatrixScatterCreate () {

    const SavedChooseGraph = Cookies.get('choose-graph');
    const [selectedMetrics, setSelectedMetrics] = useState([]);
    const [selectedDimens, setSelectedDimens] = useState([]);
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
                    <span>Показатели</span>
                    <Popup trigger={<input type="text" value={selectedMetrics.join(', ') || ''} placeholder="Выберите столбец" readOnly/>} position="right center" closeOnDocumentClick={!isOpen}>
                        <ColumnSelectionModal columns={columns} onSelectColumn={selectedColumn => handleColumnSelection(setSelectedMetrics, selectedColumn)} setSelection={setSelectedMetrics} onClose={(opened) => {handleIsOpenPopup(opened, setIsOpen)}}/>
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
                <MatrixScatterChart nameDataset={SavedChooseGraph}
                             metrics={selectedMetrics}
                             date_start={startDate}
                             date_end={endDate}
                             date_column={DateColumn}
                             dimensions={selectedDimens}
                             chartSize={chartSize}
                />
            </div>
        </div>
    )
}