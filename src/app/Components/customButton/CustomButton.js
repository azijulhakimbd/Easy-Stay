"use client"
import { ShimmerButton } from '@/components/ui/shimmer-button';
import Link from 'next/link';
import React from 'react';


const LinkBtn = ({children,href='#'}) => {
  
    
      return <Link href={href}> <ShimmerButton    className="shadow-2xl">
               <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">{children}</span>
                  </ShimmerButton>
    </Link>
   }


export default LinkBtn;