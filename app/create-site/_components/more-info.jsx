import { getAlignmentClass } from '../../utils/get-text-alignment';
import React from 'react'

const MoreInfo = ({ layoutSettings, currentColors, data }) => {


    const moreInfo = [
        { label: 'Annual Taxes', value: `$${Number(data?.annualPropertyTaxes).toLocaleString()}` },
        { label: 'MLS Number', value: data?.mlsNumber || '—' },
        { label: 'HOA', value: `${data?.condoHoaAssociationFee}` },
        { label: 'Parcel Number', value: data?.parcelNumber },
        { label: 'Fee Amount', value: `$${Number(data?.feeAmount).toLocaleString()}/${data?.terms}` },
        { label: 'Parking', value: data?.parking },
        { label: 'Terms', value: data?.terms },
        { label: 'Storage', value: data?.storage },
    ];

    const style = layoutSettings.detailLayout === 'grid' ? 'sm:grid-cols-2 grid-cols-1' : 'grid-cols-1'

    return (
        <div className='border border-border rounded-3xl p-2 py-3 w-full h-full'>
            <h1 className={`lg:text-xl headings text-lg font-semibold my-4 ${getAlignmentClass(layoutSettings)}`}>More Information</h1>
            <div className={`grid ${style}  gap-y-4 gap-x-4 w-full bg-white text-black text-sm`} style={{ backgroundColor: currentColors.backgroundColor }}>
                {moreInfo.map((item, index) => (
                    <div key={index} className="flex justify-between object-bg px-2 py-2 rounded">
                        <span className="font-semibold object-key">{item.label}</span>
                        <span className='object-value'>{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MoreInfo
