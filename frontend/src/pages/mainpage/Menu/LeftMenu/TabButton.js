import './TabButton.css';
import React from 'react';
import PropTypes from 'prop-types';

function TabButton({ name, state = '', onClick, className = '' }) {
    return (
        <button state={state} onClick={onClick} className={className}>
            {name}
        </button>
    );
}

TabButton.propTypes = {
    name: PropTypes.string.isRequired,
    active: PropTypes.bool,
    state: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string
};

export default TabButton;