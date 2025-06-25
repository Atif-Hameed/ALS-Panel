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

const BoardMap = ({ address, lat, long }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [showAddressCard, setShowAddressCard] = useState(false); // State to toggle address card

  // Initialize the base map
  useEffect(() => {
    if (!mapRef.current) return;

    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: olProj.fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
      }
    };
  }, []);

  // Update map with provided coordinates
  const updateMapWithCoordinates = (longitude, latitude, address, zoom = 12) => {
    // Remove existing vector layer
    mapInstance.current.getLayers().forEach(layer => {
      if (layer instanceof VectorLayer) {
        mapInstance.current.removeLayer(layer);
      }
    });

    // Create marker feature
    const marker = new Feature({
      geometry: new Point(olProj.fromLonLat([longitude, latitude])),
      address: address || 'N/A', // Attach address to feature for click event
    });

    marker.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: '/assets/icons/loc.svg',
          scale: 0.8,
        }),
      })
    );

    // Add vector layer
    const vectorSource = new VectorSource({ features: [marker] });
    const vectorLayer = new VectorLayer({ source: vectorSource });
    mapInstance.current.addLayer(vectorLayer);

    // Update view
    const center = olProj.fromLonLat([longitude, latitude]);
    mapInstance.current.getView().animate({
      center: center,
      zoom: zoom,
      duration: 1000,
    });

    setMarkerPosition([longitude, latitude]);
    setError(null);

    // Add click event listener for the marker
    mapInstance.current.on('singleclick', (event) => {
      mapInstance.current.forEachFeatureAtPixel(event.pixel, (feature) => {
        if (feature === marker) {
          setShowAddressCard(true); // Show address card on marker click
        }
      });
    });

    // Hide card when clicking outside the marker
    mapInstance.current.on('click', (event) => {
      const feature = mapInstance.current.forEachFeatureAtPixel(event.pixel, (f) => f);
      if (!feature) {
        setShowAddressCard(false); // Hide card if click is not on marker
      }
    });
  };

  // Process provided lat, long, and address
  useEffect(() => {
    if (!mapInstance.current) return;

    setLoading(true);
    setError(null);
    setShowAddressCard(false);

    try {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(long);

      if (!isNaN(latitude) && !isNaN(longitude)) {
        // Valid coordinates provided
        updateMapWithCoordinates(longitude, latitude, address);
      } else {
        // Invalid or missing coordinates
        throw new Error('Invalid or missing coordinates');
      }
    } catch (err) {
      console.error('Location error:', err);
      setError('Could not locate the property. Showing world map.');
      // Keep default world map view (center: [0, 0], zoom: 2)
      mapInstance.current.getView().setCenter(olProj.fromLonLat([0, 0]));
      mapInstance.current.getView().setZoom(2);
    } finally {
      setLoading(false);
    }
  }, [lat, long, address]);

  return (
    <div className="relative w-full h-fit ">
      <div ref={mapRef} className="w-full h-[400px] rounded-lg" />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="text-white">Loading map...</div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-4 rounded shadow-md text-red-500">{error}</div>
        </div>
      )}

      {markerPosition && !error && showAddressCard && (
        <div className="absolute bottom-4 left-4 z-10 bg-white p-4 rounded shadow-md text-sm max-w-xs">
          <p className="font-semibold">Address:</p>
          <p>{address || 'N/A'}</p>
        </div>
      )}
    </div>
  );
};

export default BoardMap;