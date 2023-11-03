import React, { useState } from "react";
import './Dropdown.css'
import {AiFillCaretDown} from "react-icons/ai";

export default function Dropdown({options, onSelect, savedChoose = 'All'}) {

    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        onSelect(option);
    };

    return (
        <div className="dropdown">
            <div className="selected-option">
                {selectedOption ? selectedOption.label : savedChoose}
            </div>
            <ul className="options-list">
                {options.map((option) => (
                    <li
                        key={option.id}
                        onClick={() => handleOptionSelect(option)}
                        className={selectedOption === option ? 'selected' : ''}
                    >
                        {option.label}
                    </li>
                ))}
            </ul>
            <AiFillCaretDown className="CaretDown"/>
        </div>
    )
}