import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import PaymentStatusTable from '@/components/PaymentStatusTable';
import { getServerSession } from 'next-auth';
import React from 'react';

const page = async() => {
  const session= await getServerSession(authOptions)
  return (
   <PaymentStatusTable session={session}/>
  );
};

export default page;