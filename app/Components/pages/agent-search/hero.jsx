"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useTransition, useRef } from 'react';
import Button from '../../shared/custom-btn';
import CustomInput from '../../shared/custom-input';
import Heading from '../../shared/heading';
import HeroBanner from '../../shared/hero-banner';
import { getUserSuggestions } from '../../../actions/user.action';
import { getUserLocation } from '../../../utils/get-location';

const Hero = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [searchValues, setSearchValues] = useState({
        agentName: '',
        zipCode: '',
        city: ''
    });
    const [suggestions, setSuggestions] = useState({
        agentName: [],
        zipCode: [],
        city: []
    });
    const [activeField, setActiveField] = useState(null);
    const timeoutRef = useRef(null);


    useEffect(() => {
        const storedLat = localStorage.getItem("userLat");
        const storedLng = localStorage.getItem("userLong");

        if (!storedLat || !storedLng) {
            const storeUserLocation = async () => {
                try {
                    const { latitude, longitude } = await getUserLocation();
                    localStorage.setItem("userLat", latitude.toString());
                    localStorage.setItem("userLong", longitude.toString());

                    // Only reload if location was just set
                    location.reload();
                } catch (error) {
                    console.warn("User denied location access or an error occurred:", error);
                }
            };

            storeUserLocation();
        }
    }, []);


    // Initialize form values from URL params
    useEffect(() => {
        setSearchValues({
            agentName: searchParams.get('agentName') || '',
            zipCode: searchParams.get('zipCode') || '',
            city: searchParams.get('city') || ''
        });
    }, [searchParams]);

    const fetchSuggestions = async (field, query) => {
        if (!query || query.length < 2) {
            setSuggestions(prev => ({ ...prev, [field]: [] }));
            return;
        }

        try {
            const { data } = await getUserSuggestions(field, query);
            console.log("Suggestions :", data)
            setSuggestions(prev => ({ ...prev, [field]: data.data || [] }));
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions(prev => ({ ...prev, [field]: [] }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchValues(prev => ({
            ...prev,
            [name]: value
        }));

        // Set the active field for suggestions
        setActiveField(name);

        // Clear previous timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Debounce the suggestion fetch
        timeoutRef.current = setTimeout(() => {
            fetchSuggestions(name, value);
        }, 300);
    };

    const handleClearField = (fieldName) => {
        setSearchValues(prev => ({
            ...prev,
            [fieldName]: ''
        }));
        setSuggestions(prev => ({ ...prev, [fieldName]: [] }));
    };

    const handleSuggestionClick = (field, value) => {
        setSearchValues(prev => ({
            ...prev,
            [field]: value
        }));
        setSuggestions(prev => ({ ...prev, [field]: [] }));
    };

    const handleSearch = () => {
        // Create new URLSearchParams
        const params = new URLSearchParams();

        // Always include pagination defaults
        params.set('page', '1');
        params.set('limit', '10');

        // Add non-empty search fields
        if (searchValues.agentName.trim()) params.set('agentName', searchValues.agentName.trim());
        if (searchValues.zipCode.trim()) params.set('zipCode', searchValues.zipCode.trim());
        if (searchValues.city.trim()) params.set('city', searchValues.city.trim());

        // Update URL without page reload
        startTransition(() => {
            router.push(`?${params.toString()}`, { scroll: false });
        });

        // Clear all suggestions on search
        setSuggestions({
            agentName: [],
            zipCode: [],
            city: []
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <HeroBanner bgStyle={'bg-[url("/assets/images/search-banner.png")]'}>
            <div className='h-full sm:mt-10 flex items-center'>
                <div className='lg:w-5/12 sm:w-4/6 w-full z-30 flex flex-col items-start relative'>
                    <Heading className={'text-white z-30'}>Search Agents</Heading>
                    <p className='text-lightGray lg:text-lg z-30 '>
                        Connecting agents with powerful tools that showcase you and your listings beyond your local MLS,
                        facilitating seamless referrals for lucrative fees, placing you.
                    </p>

                    <div className="w-full relative">
                        <CustomInput
                            name="agentName"
                            placeholder="Enter Agent Name"
                            inputStyle="bg-[#FFFFFFB2] border-white blue-md place placeholder:text-[#878787] text-[#878787]"
                            value={searchValues.agentName}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyPress}
                            showCross={searchValues.agentName && true}
                            onClear={() => handleClearField('agentName')}
                            onFocus={() => setActiveField('agentName')}
                        />
                        {activeField === 'agentName' && suggestions.agentName.length > 0 && (
                            <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                {suggestions.agentName.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        className="px-4 py-2 hover:bg-gray-300 cursor-pointer text-[#878787]"
                                        onClick={() => handleSuggestionClick('agentName', suggestion)}
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className='flex -mt-2 items-center sm:gap-6 gap-4 w-full z-30'>
                        <div className="flex-1 relative">
                            <CustomInput
                                name="zipCode"
                                placeholder="Enter Zip Code"
                                inputStyle="bg-[#FFFFFFB2] border-white blue-md placeholder:text-[#878787] text-[#878787]"
                                value={searchValues.zipCode}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyPress}
                                showCross={searchValues.zipCode && true}
                                onClear={() => handleClearField('zipCode')}
                                onFocus={() => setActiveField('zipCode')}
                            />
                            {activeField === 'zipCode' && suggestions.zipCode.length > 0 && (
                                <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                    {suggestions.zipCode.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            className="px-4 py-2 hover:bg-gray-300 cursor-pointer text-[#878787]"
                                            onClick={() => handleSuggestionClick('zipCode', suggestion)}
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="flex-1 relative">
                            <CustomInput
                                name="city"
                                placeholder="Enter Your City Name"
                                inputStyle="bg-[#FFFFFFB2] border-white blue-md placeholder:text-[#878787] text-[#878787]"
                                value={searchValues.city}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyPress}
                                showCross={searchValues.city && true}
                                onClear={() => handleClearField('city')}
                                onFocus={() => setActiveField('city')}
                            />
                            {activeField === 'city' && suggestions.city.length > 0 && (
                                <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                    {suggestions.city.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            className="px-4 py-2 hover:bg-gray-300 cursor-pointer text-[#878787]"
                                            onClick={() => handleSuggestionClick('city', suggestion)}
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className='w-full z-20'>
                        <Button
                            onClick={handleSearch}
                            label="SEARCH AGENT"
                            disabled={isPending}
                            loading={isPending}
                            loadingLabel='Searching...'
                            style="lg:text-xl sm:text-lg font-bold text-white bg-black !border-black !w-full py-3 px-6 rounded-lg"
                        />
                    </div>
                </div>
            </div>

            <div className='bg-[#032F5466] absolute w-full h-full top-0 left-0 z-20'></div>
        </HeroBanner>
    );
};

export default Hero;