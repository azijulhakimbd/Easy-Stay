import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import ReviewTable from '@/components/ReviewTable';
import { getServerSession } from 'next-auth';
import React from 'react';

const page = async() => {
  const session=await getServerSession(authOptions)
  return (
    <div>
        <ReviewTable session={session}/>
    </div>
  );
};

export default page;