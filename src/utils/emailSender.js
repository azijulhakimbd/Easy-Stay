import { Resend } from "resend";
import AWSVerifyEmail from "../../emailtemplate/AWSVerifyEmail";


const resend = new Resend(process.env.RESEND_API_KEY);
const emailSender=async(verifyCode)=>{
try {
    await resend.emails.send({
    from: 'Easystay <onboarding@resend.dev>',
    to: ['sifatshasan@gmail.com'],
    subject: 'Verify code from Linkup',
    react: AWSVerifyEmail({ verifyCode}),
  });
  return {success:true,message:'email send successfully'}
} catch (error) {
    console.log('error on sending email',error)
    return {success:false,message:'email send fail'}
    
}
}
export default emailSender    