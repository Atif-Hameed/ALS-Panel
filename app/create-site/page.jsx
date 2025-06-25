import { getPropertyData } from '../actions/property.action'
import React from 'react'
import CreateSite from './_components/createSite'

const page = async ({ searchParams }) => {

    const { id } = await searchParams;

    const { data, error } = await getPropertyData(id)
    if (error) {
        return (
            <h1 className='text-lg font-semibold text-center'>Something went wrong, please try again!</h1>
        )
    }

    return (
        <div className='bg-[#F4F9FD]'>
            <CreateSite data={data} propertyId={id}  />
        </div>
    )
}

export default page
