'use client'

import Image from "next/image";
import {useEffect, useState} from "react";

export default function BrandLogo() {
    const [logo, setLogo] = useState<string>('/logo/everpro-logo.svg');
    
    useEffect(() => {
        const application = document.cookie.split('; ').find(cookie => cookie.trim().startsWith('application'))?.split('=')[1];
        if (application === 'customer-lobby') {
            setLogo('/logo/cl-logo.svg');
        } else if (application === 'pulsem') {
            setLogo('/logo/pm-logo.svg');
        } else {
            setLogo('/logo/everpro-logo.svg');
        }
    }, []);
    return (
        <div className='flex basis-[75%] justify-center bg-background-light-100 shadow-xl'>
            <Image
                src={logo}
                alt="EverPro Logo"
                width={314}
                height={259}
                sizes="100vw"
            />
        </div>
    )
}