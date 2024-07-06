import React, { createContext, useState, useContext } from 'react';

const DMContext = createContext();

export const useDM = () => useContext(DMContext);

export const DMProvider = ({ children }) => {
    const [dmList, setDmList] = useState([]);

    return (
        <DMContext.Provider value={{ dmList, setDmList }}>
            {children}
        </DMContext.Provider>
    );
};
