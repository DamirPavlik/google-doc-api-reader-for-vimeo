import React, { createContext, useState } from 'react';

const StatusContext = createContext();

export const StatusProvider = ({ children }) => {
    const [status, setStatus] = useState("Logged out");

    return (
        <StatusContext.Provider value={{ status, setStatus }}>
            {children}
        </StatusContext.Provider>
    );
};

export default StatusContext;
