'use client'
import React from 'react'
import { IoMdArrowDropdown } from 'react-icons/io'

const CreateSite = ({ data, propertyId }) => {

    console.log(data)

    const navs = [
        { name: 'Themes', value: 'Themes' },
        { name: 'Layout', value: 'Layout' },
        { name: 'Colors', value: 'Colors' },
        { name: 'Fonts', value: 'Fonts' },
        { name: 'Launch', value: 'Launch' },
    ]

    const sectionContent = [
        {},
    ]

    return (
        <div>
            {/* top navs */}
            <div className='flex items-center justify-between w-full'>
                <div className='flex items-center gap-5'>
                    {
                        navs.map((e, i) => (
                            <button className='hover:text-blue-600 text-black hover:underline' >
                                {e.name}
                            </button>
                        ))
                    }
                </div>
                <button className='flex items-center gap-2'>Preview <IoMdArrowDropdown /></button>
            </div>

            <div className='w-full flex gap-4' >
                <div className='w-3/12' >
                    <h1>Will Wokr</h1>
                </div>
                <div className='flex-1' >
                    <h1>Will Wokr</h1>
                </div>
            </div>
        </div>
    )
}

export default CreateSite
