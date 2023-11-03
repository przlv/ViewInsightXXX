
export function handleColumnSelection(setSelection, column, onlyOneChoice = false) {
    if (column === null) {
        setSelection([]); // Очищаем список выбранных столбцов
    } else {
        if (!onlyOneChoice) {
            setSelection(prevSelection => {
                if (prevSelection.includes(column)) {
                    return prevSelection.filter(item => item !== column);
                } else {
                    return [...prevSelection, column];
                }
            });
        }
        else {
            setSelection(column);
        }
    }
}

export function handleIsOpenPopup(opened, setIsOpen) {
    setIsOpen(opened);
}

const formatDate = (date) => {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}/${formattedMonth}/${year}`;
}

export function handleStartDateChange(selectedDate, setStartDate) {
    const formattedDate = formatDate(selectedDate);
    setStartDate(formattedDate);
}

export function handleEndDateChange(selectedDate, setEndDate) {
    const formattedDate = formatDate(selectedDate);
    setEndDate(formattedDate);
}

export function handleResetPicker(setStartDate, setEndDate, setDateColumn = null) {
    setStartDate(null);
    setEndDate(null);
    if (setDateColumn) {
        setDateColumn(null);
    }
}