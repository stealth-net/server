import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Slider.css';
import Config from "./Config";

const Slider = ({ dataSetting, dataDefault, label, min, max }) => {
    const [value, setValue] = useState(0);

    useEffect(() => {
        const loadConfigValue = async () => {
            const configValue = await Config.getValue(dataSetting);
            setValue(configValue !== null ? configValue : parseInt(dataDefault, 10));
        };

        loadConfigValue();

        const handleConfigChange = () => {
            setValue(Config.getValue(dataSetting));
        };

        document.addEventListener('configChange', handleConfigChange);

        return () => {
            document.removeEventListener('configChange', handleConfigChange);
        };
    }, [dataSetting, dataDefault]);

    const handleChange = (event) => {
        setValue(event.target.value);
        const config = JSON.parse(localStorage.getItem('config')) || {};
        config[dataSetting] = parseInt(event.target.value, 10);
        localStorage.setItem('config', JSON.stringify(config));
        const configChangeEvent = new Event('configChange');
        document.dispatchEvent(configChangeEvent);
    };

    return (
        <div className="slider-container">
            <label htmlFor={dataSetting} className="slider-label">
                {label}: <span className="slider-value">{value}</span>
            </label>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                className="slider"
                data-setting={dataSetting}
                data-default={dataDefault}
                onChange={handleChange}
            />
        </div>
    );
};

Slider.propTypes = {
    dataSetting: PropTypes.string,
    dataDefault: PropTypes.string,
    label: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number
};

Slider.defaultProps = {
    dataSetting: "data-example",
    dataDefault: "0",
    label: "Label",
    min: 0,
    max: 10
};

export default Slider;