import { getAlignmentClass } from '../../utils/get-text-alignment';
import React from 'react'

const PropertyDetails = ({ layoutSettings, currentColors,  data }) => {

    console.log(currentColors)

    const Details = [
        { label: 'Price', value: `$${Number(data?.price).toLocaleString()}` },
        { label: 'Lot Size', value: `${data?.lotSizePropertySize} Sq. Ft.` },
        { label: 'Bedrooms', value: data?.bedrooms },
        { label: 'Year Built', value: data?.yearBuilt },
        { label: 'Bathrooms', value: data?.bathrooms },
        { label: 'Property Type', value: data?.propertyType },
        { label: 'Building Size', value: `${data?.buildingSize} Sq. Ft.` },
        { label: 'Architectural Style', value: data?.architecturalStyle },
        { label: 'Square feet', value: data?.buildingSize },
    ];

    const style = layoutSettings.detailLayout === 'grid' ? 'sm:grid-cols-2 grid-cols-1' : 'grid-cols-1'

    return (
        <div className='border border-border rounded-3xl p-2 py-3 w-full'>
            <h1 className={`lg:text-xl headings text-lg font-semibold  my-5 ${getAlignmentClass(layoutSettings)}`}>Property Details</h1>
            <div className={`grid ${style}  gap-y-4 gap-x-4 w-full bg-white text-black text-sm`} style={{ background: currentColors.backgroundColor }}>
                {Details.map((item, index) => (
                    <div key={index} className={`flex justify-between sm:flex-row  object-bg px-2 py-2 rounded`}>
                        <span className="font-semibold object-key">{item.label}</span>
                        <span className='object-value'>{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PropertyDetails
