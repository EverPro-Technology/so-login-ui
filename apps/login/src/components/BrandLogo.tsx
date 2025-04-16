'use client'

import Image from "next/image";

export default function BrandLogo() {
  return (
      <div className='flex basis-[75%] justify-center bg-background-light-100 shadow-xl'>
          <Image
              src='/logo/cl-logo.svg'
              alt="EverPro Logo"
              width={314}
              height={259}
              sizes="100vw"
          />
      </div>
  )
}