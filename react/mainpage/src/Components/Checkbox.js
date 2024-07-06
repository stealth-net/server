import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Checkbox.css';
import Config from "./Config"

const Checkbox = ({ title, dataSetting, dataDefault, label }) => {
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const loadConfigValue = async () => {
            const value = await Config.getValue(dataSetting);
            setChecked(value !== null ? value : (dataDefault === "true"));
        };

        loadConfigValue();

        const handleConfigChange = () => {
            setChecked(Config.getValue(dataSetting));
        };

        document.addEventListener('configChange', handleConfigChange);

        return () => {
            document.removeEventListener('configChange', handleConfigChange);
        };
    }, [dataSetting, dataDefault]);

    const handleChange = (event) => {
        setChecked(event.target.checked);
        const config = JSON.parse(localStorage.getItem('config')) || {};
        config[dataSetting] = event.target.checked;
        localStorage.setItem('config', JSON.stringify(config));
        const configChangeEvent = new Event('configChange');
        document.dispatchEvent(configChangeEvent);
    };

    return (
        <label title={title} className="checkbox-container">
            <input
                type="checkbox"
                className="checkbox-input"
                data-setting={dataSetting}
                data-default={dataDefault}
                checked={checked}
                onChange={handleChange}
            />
            <div className="checkbox-custom"></div>
            <span>{label}</span>
        </label>
    );
};

Checkbox.propTypes = {
    title: PropTypes.string,
    dataSetting: PropTypes.string,
    dataDefault: PropTypes.string,
    label: PropTypes.string
};

Checkbox.defaultProps = {
    title: "Enable this option",
    dataSetting: "data-example",
    dataDefault: "false",
    label: "Label"
};

export default Checkbox;