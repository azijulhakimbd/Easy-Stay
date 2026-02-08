
import mongoose from "mongoose"



const connection={}
 const  dbConnect=async()=>{

    if (connection.isConnected){
        
       return   console.log('mongodb already connected to the database with mongoose and mongodb')
    }
    try {
        
        const db=await mongoose.connect(process.env.MONGO_URL || "")
       
        connection.isConnected=db.connections[0].readyState;
        
    } catch (error) {
         console.log('mongodb is not connected to the  database on',error)
         process.exit(1)
    }
}
export default dbConnect