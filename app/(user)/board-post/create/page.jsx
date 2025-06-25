'use client';

import React, { useEffect, useState } from 'react';
import { generateBoardData } from '../../../data/index';
import CreatePost from '../../../Components/pages/board-post/createPost';
import { useUserDetails } from '../../../hooks/useUser';
import { getUserLocation } from '../../../utils/get-location';
import Back from '../../../Components/shared/back-btn';

const Page = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const { data: user } = useUserDetails(userId);

  // Get userId from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
      }
    }
  }, []);

  // Store user location in localStorage if not already set
  const storeUserLocation = async () => {
    try {
      const storedLat = localStorage.getItem('userLat');
      const storedLng = localStorage.getItem('userLong');

      if (!storedLat || !storedLng) {
        const { latitude, longitude } = await getUserLocation();
        localStorage.setItem('userLat', latitude.toString());
        localStorage.setItem('userLong', longitude.toString());
        // Reload page after storing location
        location.reload();
      }
    } catch (error) {
      console.warn('User denied location access or an error occurred:', error);
      setError('Please allow location to proceed.');
      setLoading(false);
    }
  };

  // Request location permission and fetch data
  const requestLocationPermission = async () => {
    try {
      setLoading(true);
      setError(null);
      await storeUserLocation(); // This will handle location storage and reload if needed
      // If no reload occurs (location already set), fetch data
      const boardData = await generateBoardData();
      if (!boardData) {
        setError('Failed to fetch data. Please try again.');
      } else {
        setData(boardData);
      }
    } catch (err) {
      if (err.code === err.PERMISSION_DENIED) {
        setError('Location access denied. Please allow location to proceed.');
      } else {
        setError('Unable to access location. Please try again.');
      }
      console.error('Error generating board data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check location and load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const storedLat = localStorage.getItem('userLat');
        const storedLng = localStorage.getItem('userLong');

        if (!storedLat || !storedLng) {
          // Trigger location permission prompt and store coordinates
          await storeUserLocation();
        } else {
          // Location already stored, fetch data
          const boardData = await generateBoardData();
          if (!boardData) {
            setError('Failed to fetch data. Please try again.');
          } else {
            setData(boardData);
          }
        }
      } catch (error) {
        setError('Please allow location to proceed.');
        console.error('Error generating board data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div>
      {loading && (
        <h1 className="text-center py-20 w-full">Loading...</h1>
      )}
      {error && (
        <div className="text-center py-20 w-full">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button
            onClick={requestLocationPermission}
            className="px-4 py-2 bg-dark text-white rounded transition"
          >
            📍 Allow Location
          </button>
        </div>
      )}

      {!loading && data && (
        <div className='w-full h-full'>
          <Back href={'/board-post'} />
          <CreatePost data={data} user={user} />
        </div>
      )}
    </div>
  );
};

export default Page;