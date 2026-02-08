import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <h1 className="text-2xl font-bold text-red-500">
        🚫 You are not authorized to view this page.
      </h1>
    
          <Link href={"/"}>  <Button className={'my-4 cursor-pointer'} >Back To Home</Button></Link> 
  
 
    </div>
  )
}