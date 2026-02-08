"use client"
import { SessionProvider } from 'next-auth/react';

import React from 'react';

const SessionProviderWrapper = ({children}) => {
    return (
        <SessionProvider >{children}</SessionProvider>
    );
};

export default SessionProviderWrapper;