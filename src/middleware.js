import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;



    if (pathname==='/api/property'){
      // console.log(token,"this is from api property")
      
        if (req.method ==="GET" ){

         return NextResponse.next()
        } else if(token && (token?.role==="host" || token?.role==='admin')){
          return NextResponse.next()
        }else{
       return   NextResponse.json({
            success:false,
            message:'Forbidden user'
          },
        {
          status:403
        })
        }
        }
         if (pathname.startsWith('/api/property/')){
  
      
        if (req.method ==="GET" ){
         if(token){
          
                return NextResponse.next()
         } 
         return NextResponse.json({
          success:false,
          message:"unauthorize user"
         },{
          status:401
         })
        
        } else if(token && (token?.role==="host" || token?.role==='admin')){
          return NextResponse.next()
        } else if (pathname.endsWith('calculate-price') && token){
           
          return NextResponse.next()


        } else{
       return   NextResponse.json({
            success:false,
            message:'Forbidden user'
          },
        {
          status:403
        })
        }
        }

      
       

    



    // frontend protection
// ------------------------u--------------0------------------------------------------
    if (pathname==="/stay/") {
      if (token) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (pathname.startsWith("/host")) {
      if (token?.role === "host" || token?.role === "admin") {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
// ------------------------------------------------0----------------------------------
    if (pathname.startsWith("/dashboard/guest")) {
      if (token?.role === "user" || token?.role === "admin") {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }


    // ------------------------------------------------0------------------------------------------------
    if (pathname.startsWith("/dash/admin")) {
      if (token?.role === "admin") {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;

        if (
          pathname.startsWith("/host") ||
         
          pathname.startsWith("/dashboard/guest") ||
          pathname.startsWith("/dash/admin") ||
           pathname.startsWith("/api/property") ||
          pathname.startsWith("/api/property/:path*")
        ) {
          return true;
        }
        if (pathname === "/stays") {
          return true;
        }


        if (pathname==='/stay/'){
          return !!token
        }
      },
    },
  }
);

export const config = {
  matcher: [
    "/stays/:path*",
    "/host/:path*",
    "/dashboard/guest/:path*",
    "/dash/admin/:path*",
    "/api/property",
    "/api/property/:path*",
  ],
};
