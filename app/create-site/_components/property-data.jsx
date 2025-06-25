import { getAlignmentClass } from '../../utils/get-text-alignment'
import React from 'react'

const PropertyData = ({ layoutSettings, data }) => {

    return (
        <div className={`w-full mb-3 ${getAlignmentClass(layoutSettings)}`}>
            <h1 className='lg:text-4xl headings sm:text-3xl text-2xl'>{data?.headline || '-'}</h1>
            <div className='break-all w-full subheading'>
                <h1>{data?.address1 || data?.address2 || data?.displayAddress}</h1>
            </div>
        </div>
    )
}

export default PropertyData
