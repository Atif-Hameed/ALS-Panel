import { getAlignmentClass } from '../../utils/get-text-alignment'
import React from 'react'

const Description = ({ layoutSettings, data }) => {
    return (
        <div className={`flex flex-col gap-3 mt-8 text-center  ${getAlignmentClass(layoutSettings)}`}>
            <h1 className='sm:text-2xl text-xl subheading font-medium '>{data?.shortDescription}</h1>
            <p className='sm:text-base text-sm paragraph'>{data?.longDescription}</p>
        </div>
    )
}

export default Description
