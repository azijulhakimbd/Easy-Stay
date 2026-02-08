import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import BookingTable from '@/components/BookingTable';
import { getServerSession } from 'next-auth';
import React from 'react';

const page =async () => {
  const session=await getServerSession(authOptions)
  return (
   <BookingTable session={session}/>
  );
};

export default page;