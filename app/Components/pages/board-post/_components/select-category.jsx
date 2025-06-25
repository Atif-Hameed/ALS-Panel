'use client'
import React from 'react'
import Button from '../../../../Components/shared/custom-btn'

const SelectCategory = ({selectedPostType, selectedCategory, setSelectedCategory, goBack, handleNext}) => {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Select Category</h2>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                {selectedPostType.categories.map((category, index) => (
                    <div key={index} className="flex items-center  p-2 border border-border rounded hover:bg-gray-50">
                        <input
                            type="radio"
                            id={`category-${index}`}
                            name="category"
                            checked={selectedCategory?.name === category.name}
                            onChange={() => setSelectedCategory(category)}
                            className="mr-3"
                        />
                        <label htmlFor={`category-${index}`} className="flex-1 cursor-pointer">
                            {category.name}
                            {category.subCategories?.length > 0 && (
                                <span className="text-sm text-gray-500 ml-2">({category.subCategories.length} subcategories)</span>
                            )}
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
                    disabled={!selectedCategory}
                    label='Next'
                />
            </div>
        </div>
    )
}

export default SelectCategory
