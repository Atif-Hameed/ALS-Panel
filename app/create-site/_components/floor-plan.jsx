import Image from 'next/image'
import React from 'react'
import { getAlignmentClass } from '../../utils/get-text-alignment';

const FloorPlan = ({ layoutSettings, data }) => {
    return (
        <div className="w-full mt-8 flex flex-col items-center">
            <h1 className={`lg:text-xl headings w-full text-lg font-semibold my-5 ${getAlignmentClass(layoutSettings)}`}>Floor Plans</h1>
            <div className="flex flex-col gap-6 w-5/6">
                {data?.map((floorPlanItem) => (
                    floorPlanItem?.floorPlans?.map((plan, index) => (
                        <div key={`${floorPlanItem._id}-${index}`} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="aspect-w-16 aspect-h-9 relative h-[400px]">
                                <Image
                                    src={plan.url}
                                    alt={plan.planName}
                                    fill
                                    className="object-cover"
                                    quality={100}
                                />
                            </div>
                        </div>
                    ))
                ))}
            </div>
        </div>
    )
}

export default FloorPlan