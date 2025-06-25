'use client';

import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import * as olProj from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import { getAlignmentClass } from '../../utils/get-text-alignment';

const PropertyMap = ({ layoutSettings, address, city }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [loading, setLoading] = useState(true);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [error, setError] = useState(null);

  // Initialize the base map
  useEffect(() => {
    if (!mapRef.current) return;

    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: olProj.fromLonLat([0, 0]),
        zoom: 2
      })
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
      }
    };
  }, []);

  // Function to geocode a location
  const geocodeLocation = async (locationQuery) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}`
      );
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Geocoding error:', err);
      return null;
    }
  };

  // Function to update the map with coordinates
  const updateMapWithCoordinates = (longitude, latitude, zoom = 12) => {
    // Remove existing vector layer
    mapInstance.current.getLayers().forEach(layer => {
      if (layer instanceof VectorLayer) {
        mapInstance.current.removeLayer(layer);
      }
    });

    // Create marker feature
    const marker = new Feature({
      geometry: new Point(olProj.fromLonLat([longitude, latitude])),
    });

    marker.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: '/assets/icons/loc.svg',
          scale: 0.8
        })
      })
    );

    // Add vector layer
    const vectorLayer = new VectorLayer({
      source: new VectorSource({ features: [marker] })
    });

    mapInstance.current.addLayer(vectorLayer);

    // Update view
    const center = olProj.fromLonLat([longitude, latitude]);
    mapInstance.current.getView().animate({
      center: center,
      zoom: zoom,
      duration: 1000
    });

    setMarkerPosition([longitude, latitude]);
    setError(null);
  };

  // Validate input to check if it's a valid string
  const isValidInput = (input) => {
    return typeof input === 'string' && input.trim().length > 0 && input.trim().match(/[A-Za-z0-9]/);
  };

  // Geocode address and update map with fallback to city
  useEffect(() => {
    if (!mapInstance.current) return;

    const locateProperty = async () => {
      setLoading(true);
      setError(null);

      try {
        // Validate inputs
        const hasValidAddress = isValidInput(address);
        const hasValidCity = isValidInput(city);

        if (!hasValidAddress && !hasValidCity) {
          throw new Error('No valid address or city provided.');
        }

        // Try with full address first
        if (hasValidAddress) {
          const addressData = await geocodeLocation(address);
          if (addressData && addressData.length > 0) {
            const { lon, lat } = addressData[0];
            return updateMapWithCoordinates(parseFloat(lon), parseFloat(lat), 12);
          } else {
            console.warn(`No geocoding results for address: ${address}`);
          }
        }

        // If address not found, use city from props
        if (hasValidCity) {
          const cityData = await geocodeLocation(city);
          if (cityData && cityData.length > 0) {
            const { lon, lat } = cityData[0];
            return updateMapWithCoordinates(parseFloat(lon), parseFloat(lat), 8);
          } else {
            console.warn(`No geocoding results for city: ${city}`);
          }
        }

        // If all attempts fail
        throw new Error('Unable to locate the provided address or city.');
      } catch (err) {
        console.error('Location error:', err.message);
        setError(
          err.message === 'No valid address or city provided.'
            ? 'Please provide a valid address or city.'
            : 'The provided address or city could not be located. Showing world map.'
        );
      } finally {
        setLoading(false);
      }
    };

    locateProperty();
  }, [address, city]);

  return (
    <div className="relative w-full h-fit">
      <h1 className={`lg:text-xl headings text-lg font-semibold w-full my-5 ${getAlignmentClass(layoutSettings)}`}>Map</h1>
      <div
        ref={mapRef}
        className="w-full h-[450px]"
      />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="text-white">Locating address...</div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-4 rounded shadow-md text-red-500">{error}</div>
        </div>
      )}

      {markerPosition && !error && (
        <div className="absolute bottom-4 left-4 z-10 bg-white p-2 rounded shadow-md text-sm">
          Longitude: {markerPosition[0].toFixed(4)}, Latitude: {markerPosition[1].toFixed(4)}
        </div>
      )}
    </div>
  );
};

export default PropertyMap;