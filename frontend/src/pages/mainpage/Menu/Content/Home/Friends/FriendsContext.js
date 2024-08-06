import React, { createContext, useState, useContext } from 'react';

const FriendsContext = createContext();

export const useFriends = () => useContext(FriendsContext);

export const FriendsProvider = ({ children }) => {
    const [friends, setFriends] = useState([]);

    return (
        <FriendsContext.Provider value={{ friends, setFriends }}>
            {children}
        </FriendsContext.Provider>
    );
};