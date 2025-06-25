import CustomImage from '../../Components/shared/custom-image'
import React from 'react'

const UserPropertyData = ({ data }) => {
    return (
        <div className='flex items-center gap-2 mt-2' >
            <div>
                <CustomImage src={data?.profileImage || '/assets/images/dumy.png'} className={'h-9 w-9'} />
            </div>
            <div className='text-black paragraph text-xs'>
                <div className='flex items-center gap-2'>
                    <h1 className=' font-medium subheading'>{data?.companyName || '-'}</h1>
                    <h1 className=' '>{data?.officeName || '-'}</h1>
                </div>
                <h1 className=' '>{data?.phoneNumber || '-'}</h1>
            </div>
        </div>
    )
}

export default UserPropertyData;
