"use client"

import React from 'react';


import { ShimmerButton } from '@/components/ui/shimmer-button';
const SignOutBtn = ({children,...props}) => {
  
    
      return  <ShimmerButton {...props}  className="shadow-2xl">
               <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">{children}</span>
                  </ShimmerButton>
    
   }


export default SignOutBtn;