'use client'
import toast from 'react-hot-toast'
import { assignProperty, assignPropertyToReferal, getProperties } from '../../actions/property.action'
import React, { useEffect, useState } from 'react'
import Button from '../../Components/common/custom-button'
import { Trash2, Trash2Icon } from 'lucide-react'
import { API_BASE_URL } from '../../../app/api'

const AddProperty = ({ userId, referalUserId, handleCloseAddProperty }) => {
    const [properties, setProperties] = useState([]);
    const [assignedProperties, setAssignedProperties] = useState([]);
    const [selectedProperties, setSelectedProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [deleting, setDeleting] = useState(false);

    console.log("reresl:", referalUserId)

    const fetchProperties = async () => {
        try {
            setFetching(true);
            const { data, error } = await getProperties(userId);
            if (error) throw new Error(error);
            setProperties(data?.properties || []);
        } catch (error) {
            // toast.error(error.message || 'Failed to fetch properties');
            console.error(error);
        } finally {
            setFetching(false);
        }
    };

    const fetchAssignedProperties = async () => {
        try {
            setFetching(true);
            const { data, error } = await getProperties(referalUserId);
            console.log(data)
            if (error) throw new Error(error);
            setAssignedProperties(data?.properties || []);
        } catch (error) {
            // toast.error(error.message || 'Failed to fetch assigned properties');
            console.error(error);
        } finally {
            setFetching(false);
        }
    };

    const assignPropertyToReferral = async () => {
        if (selectedProperties.length === 0) {
            toast.error('Please select at least one property');
            return;
        }
        try {
            setLoading(true);
            // Get the actual property IDs from the selected property names
            const propertyIds = properties
                .filter(property => selectedProperties.includes(property.propertyName))
                .map(property => property._id);

            const { data, error, success } = await assignPropertyToReferal(
                propertyIds,
                userId,
                referalUserId
            );

            console.log(data)

            if (error) throw new Error(error);

            toast.success(success || `${selectedProperties.length} properties assigned successfully!`);
            await fetchAssignedProperties();
            setSelectedProperties([]);
        } catch (error) {
            toast.error(error.message || 'Failed to assign properties');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePropertySelection = (e) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedProperties(selected);
    };

    const handleDeleteProperty = async (propertyId, userId = referalUserId) => {
        try {
            setDeleting(true);
            const response = await fetch(
                `${API_BASE_URL}/property/delete-user-property/${propertyId}/${userId}`,
                {
                    method: "DELETE",
                }
            );

            console.log(response)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Refresh both properties lists after deletion
            await fetchProperties();
            await fetchAssignedProperties();

            toast.success("Property removed successfully!");
        } catch (error) {
            console.error("Failed to delete property:", error);
            toast.error(error.message || "Error deleting property.");
        } finally {
            setDeleting(false);
        }
    };

    // Check if a property is assigned
    const isAssigned = (propertyName) => {
        return assignedProperties.some(prop => prop.propertyName === propertyName);
    };

    useEffect(() => {
        if (userId && referalUserId) {
            fetchProperties();
            fetchAssignedProperties();
        }
    }, [userId, referalUserId]);

    return (
        <div className='w-full max-w-md mx-auto'>
            <h1 className='text-2xl font-bold text-gray-800 text-center mb-6'>Assign Properties</h1>

            {fetching ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Properties
                            <span className="text-xs text-gray-500 ml-1">(Hold Ctrl/Cmd to select multiple)</span>
                        </label>

                        <div className="relative">
                            <select
                                multiple
                                value={selectedProperties}
                                onChange={handlePropertySelection}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-auto min-h-[120px]"
                                size={5}
                            >
                                {properties.map((property) => {
                                    const assigned = isAssigned(property.propertyName);
                                    return (
                                        <option
                                            key={property._id}
                                            value={property.propertyName}
                                            className={`p-2 hover:bg-blue-50 ${assigned ? 'bg-gray-100' : ''}`}
                                            disabled={assigned}
                                        >
                                            {property.propertyName}
                                            {assigned && ' (Assigned)'}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        {/* Show assigned properties with delete buttons below the select */}
                        {assignedProperties.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Assigned Properties:</h3>
                                <ul className="space-y-2">
                                    {assignedProperties.map((property) => (
                                        <li key={property._id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                            <span className="text-sm text-gray-600">
                                                {property.propertyName}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteProperty(property._id)}
                                                className="text-red-500 cursor-pointer hover:text-red-700 p-1"
                                                disabled={deleting}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {selectedProperties.length > 0 && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-700 mb-1">Selected Properties:</h3>
                                <ul className="max-h-20 overflow-y-auto">
                                    {selectedProperties.map((property, index) => (
                                        <li key={index} className="text-sm text-gray-600 py-1 flex items-center">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                            {property}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button
                            onClick={assignPropertyToReferral}
                            label={`Assign ${selectedProperties.length > 0 ? `(${selectedProperties.length})` : ''}`}
                            loading={loading}
                            loadingLabel='Assigning...'
                            className="sm:px-6 px-4 !h-[48px] bg-dark rounded-lg text-white  disabled:opacity-50"
                            disabled={selectedProperties.length === 0}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default AddProperty;