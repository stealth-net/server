import './TabButton.css';
import React from 'react';
import PropTypes from 'prop-types';

function TabButton({ name, state = '', onClick }) {
    return (
        <button state={state} onClick={onClick}>
            {name}
        </button>
    );
}

TabButton.propTypes = {
    name: PropTypes.string.isRequired,
    active: PropTypes.bool,
    state: PropTypes.string,
    onClick: PropTypes.func.isRequired
};

export default TabButton;