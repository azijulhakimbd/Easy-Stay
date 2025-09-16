import mongoose, { Schema } from 'mongoose'



const userSchema=new Schema({
    username:{
        type:String,
        required:[true,'Please provide username'],
    unique:true
    },
    password:{
        type:String,
        required:['true','please provide password']
    },
    email:{
        type:String,
        required:[true,'Please provide username'],
       unique:true,
       match:[/.+\@.+\..+/,'gives valid email']
    },
    verifyCode:{
        type:String,
        required:[true,'Please provide username'],
    
    },
      verifyCodeExpiry:{
        type:Date,
        required:[true,'Please provide username'],
    
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        default:'user'
    }

})

const User=mongoose.models.users || mongoose.model('users',userSchema)
export default User