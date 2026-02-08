"use client"
import HostChatBox from '@/components/HostChatBox/HostChatBox';
import { useSession } from 'next-auth/react';
import React from 'react';

const HostMessages = () => {
     const {data:session}=useSession()
     console.log(session,'this is session')
     const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const hostId = session?.user._id
  const hostName = "Host";
   
       
 

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">💬 Host Messages</h2>
      <HostChatBox apiKey={apiKey} hostId={hostId} hostName={hostName} />
    </div>
  );

};

export default HostMessages;