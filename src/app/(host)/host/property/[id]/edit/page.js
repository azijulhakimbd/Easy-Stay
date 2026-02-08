
import ReuseableForm from '@/components/ReuseableForm';
import React from 'react';

const EditPage = async({params}) => {
   const {id}=await params
    console.log(id)
    return (
        <div className='mt-20'>
           <ReuseableForm propertyId={id}/>
        </div>
    );
};

export default EditPage;