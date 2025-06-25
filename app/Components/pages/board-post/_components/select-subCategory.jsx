'use client'
import React from 'react'
import Button from '../../../../Components/shared/custom-btn'

const SelectSubCategory = ({ selectedCategory, selectedSubCategory, setSelectedSubCategory, goBack, handleNext }) => {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Select Subcategory</h2>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                {selectedCategory.subCategories.map((subCat, index) => (
                    <div key={index} className="flex items-center  p-2 border border-border rounded hover:bg-gray-50">
                        <input
                            type="radio"
                            id={`subcat-${index}`}
                            name="subcategory"
                            checked={selectedSubCategory?.name === subCat.name}
                            onChange={() => setSelectedSubCategory(subCat)}
                            className="mr-3"
                        />
                        <label htmlFor={`subcat-${index}`} className="flex-1 cursor-pointer">
                            {subCat.name}
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
                    disabled={!selectedSubCategory}
                    label='Next'
                />
            </div>
        </div>
    )
}

export default SelectSubCategory
