import './TabButton.css';
import React from "react";
import PropTypes from 'prop-types';

function TabButton({ name, active, onClick }) {
    return <button className={`home-tabbutton ${active ? "active" : ""}`} onClick={onClick}>{name}</button>;
}

TabButton.propTypes = {
    name: PropTypes.string.isRequired,
    active: PropTypes.bool,
    onClick: PropTypes.func.isRequired
};

export default TabButton;