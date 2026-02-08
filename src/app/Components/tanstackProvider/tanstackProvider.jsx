"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const TanstackProvider = ({children}) => {
    const [queryClient] = React.useState(() => new QueryClient())
    return (
           <QueryClientProvider client={queryClient}>
           {children}

           </QueryClientProvider>
          
      
    );
};

export default TanstackProvider;