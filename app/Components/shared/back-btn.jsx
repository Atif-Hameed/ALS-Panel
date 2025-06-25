import Link from 'next/link'
import React from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";

const Back = ({ href }) => {
    return (
        <Link href={href} className='text-black/70 w-fit hover:text-black flex items-center gap-2 mb-2'>
            <FaArrowLeftLong className='text-lg' /> Back
        </Link>
    )
}

export default Back
