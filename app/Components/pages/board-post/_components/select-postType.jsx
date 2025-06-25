'use client'
import Button from '../../../../Components/shared/custom-btn'
import React from 'react'

const SelectPostType = ({ postTypes, selectedPostType, setSelectedPostType, goBack, handleNext }) => {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Select Post Type</h2>
            <div className="space-y-2">
                {postTypes.map((type, index) => (
                    <div key={index} className="flex items-center  p-2 border border-border rounded hover:bg-gray-50">
                        <input
                            type="radio"
                            id={`type-${index}`}
                            name="postType"
                            checked={selectedPostType?.name === type.name}
                            onChange={() => setSelectedPostType(type)}
                            className="mr-3"
                        />
                        <label htmlFor={`type-${index}`} className="flex-1 cursor-pointer">
                            {type.name}
                        </label>
                    </div>
                ))}
            </div>
            <div className="mt-4 flex justify-between">
                <Button
                    onClick={goBack}
                    style="px-4 py-2 bg-gray-400 rounded hover:bg-gray-600"
                    label='Back'
                />
                <Button
                    onClick={handleNext}
                    style="px-6 py-2 bg-dark text-white rounded "
                    disabled={!selectedPostType}
                    label='Next'
                />
            </div>
        </div>
    )
}

export default SelectPostType
