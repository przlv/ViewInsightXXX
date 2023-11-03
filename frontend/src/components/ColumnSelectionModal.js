import './ColumnSelectionModal.css'

export default function ColumnSelectionModal({columns, onSelectColumn}) {

    const handleColumnSelection = (column) => {
        onSelectColumn(column);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h4>Выбор столбца</h4>
                <ul className="modal-content-ul">
                    <li className='modal-content-li' key={'Не выбрано'} onClick={() => handleColumnSelection(null)}>
                        {'Не выбрано'}
                    </li>
                    {columns.map((column) => (
                        <li className='modal-content-li' key={column} onClick={() => handleColumnSelection(column)}>
                            {column}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
