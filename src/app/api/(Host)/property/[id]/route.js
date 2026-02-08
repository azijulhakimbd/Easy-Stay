import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import '@/models/index'
import { Property } from "@/models/propertie.models"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"



export const GET=async(req,{params})=>{
 
    const {id}=await params
   
    await dbConnect()
     const session = await getServerSession( authOptions)
     

  
 
   try {
    const property=await Property.findById(id).populate("hostId", "email").populate("amenities").lean();
   
 if (property._id) property._id = property._id.toString();



if (Array.isArray(property.amenities)) {
  property.amenities = property.amenities.map((amenity) => ({
    _id: amenity._id?.toString(),
    name: amenity.name
  }));
}


if (property.hostId && property.hostId._id) {
  property.hostId._id = property.hostId._id.toString();
}


    return NextResponse.json({
            status:'success',
           data:property
          },
        {status:200})
   } catch (error) {

        return NextResponse.json({
            success:'false',
            message:`Fail to connect the database ${error.message}`
        },
    {
        status:500
    })
   }

}


// export const PATCH = async (req, { params }) => {
//   await dbConnect();
//   const { id } =await params;
//   console.log(id)
//   const body=await req.json()
  
 

//   try {
  
//     console.log(body)
//     const updatedProperty = await Property.findByIdAndUpdate(id,{$set:body});

//     if (!updatedProperty) {
//       return NextResponse.json(
//         { status: 'fail', message: 'Property not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { status: 'success', data: updatedProperty?.status },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { status: 'fail', message: 'Failed to update property' },
//       { status: 500 }
//     );
//   }
// };

export const PUT=async(request,{params})=>{
  
await dbConnect()

   const {id}=await params
   const body=await request.json()
   delete body._id
console.log(id,body)
  try {
   
    const response=await Property.findByIdAndUpdate(id,body,{new:true}, {overwrite: true})


console.log(response)
    if (!response)
      {
 return NextResponse.json({
  status:'fail',
  message:'Property is not find'
 },
 {status:404}
   )
    }
 

 return NextResponse.json({
    status:'success',
    message:response
  },
{status:201})



  } catch (error) {
    return NextResponse.json({
      status:'fail',
      message:'Inter server problem'
    },
    {status:500}
  )
  }
}


export const DELETE = async (req, { params }) => {
  await dbConnect();
 const {id}=await params

  try {
    const deletedProperty = await Property.findByIdAndDelete(id);

    if (!deletedProperty) {
      return NextResponse.json(
        { status: 'fail', message: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: 'success', message: 'Property deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 'fail', message: 'Failed to delete property' },
      { status: 500 }
    );
  }
};