'use client'
import Button from '../../../../Components/shared/custom-btn'
import React from 'react'

const SelectLocation = ({ locations, selectedLocation, setSelectedLocation, handleNext }) => {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Select a Location</h2>
            <div className="space-y-2">
                {locations.map((loc, index) => (
                    <div key={index} className="flex items-center p-2 border border-border rounded hover:bg-gray-50">
                        <input
                            type="radio"
                            id={`location-${index}`}
                            name="location"
                            checked={selectedLocation?.address === loc.address}
                            onChange={() => setSelectedLocation(loc)}
                            className="mr-3"
                        />
                        <label htmlFor={`location-${index}`} className="flex-1 cursor-pointer">
                            {loc.address}
                        </label>
                    </div>
                ))}
            </div>
            <div className="mt-4 flex justify-end">
                <Button
                    onClick={handleNext}
                    style="px-6 py-2 bg-dark text-white rounded "
                    disabled={!selectedLocation}
                    label='Next'
                />
            </div>
        </div>
    )
}

export default SelectLocation
