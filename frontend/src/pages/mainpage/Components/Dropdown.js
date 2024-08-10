import React, { useState, useEffect } from 'react';
import './Dropdown.css';

const Dropdown = ({ title, dataSetting, dataDefault, label, options, handleChange }) => {
    const [selectedValue, setSelectedValue] = useState(dataDefault);

    useEffect(() => {
        const storedValue = localStorage.getItem(dataSetting);
        if (storedValue) {
            setSelectedValue(storedValue);
        }
    }, [dataSetting]);

    const handleLocalChange = (event) => {
        const newValue = event.target.value;
        setSelectedValue(newValue);
        localStorage.setItem(dataSetting, newValue);
        if (handleChange) {
            handleChange(event);
        }
    };

    return (
        <div className="dropdown-container">
            <label title={title} htmlFor={dataSetting}>{label}</label>
            <select
                id={dataSetting}
                name={dataSetting}
                value={selectedValue}
                onChange={handleLocalChange}
                className="dropdown"
            >
                {options.map((option, index) => (
                    <option key={index} value={option} className="dropdown-option">
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Dropdown;