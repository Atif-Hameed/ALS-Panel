import CustomImage from '../../Components/shared/custom-image'
import React from 'react'

const UserData = ({ data }) => {
    console.log(data)
    return (
        <div className='flex items-center gap-2' >
            <div>
                <CustomImage src={data?.profileImage || '/assets/images/dumy.png'} className={'h-20 w-20'} />
            </div>
            <div className='text-black paragraph'>
                <h1 className='text-lg font-medium subheading'>{data?.companyName || '-'}</h1>
                <h1 className='text-sm '>{data?.officeName || '-'}</h1>
                <h1 className='text-sm '>{data?.phoneNumber || '-'}</h1>
                <h1 className=' text-sm flex gap-2'><span>Tel# {data?.telegram || '-'}</span> <span>Whts# {data?.whatsappNumber || '-'}</span></h1>
            </div>
        </div>
    )
}

export default UserData
