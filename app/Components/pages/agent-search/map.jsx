'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
import CustomImage from '../../shared/custom-image';
import { getDistance } from 'ol/sphere';

const OpenLayersMap = ({ data, onViewChange }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const [isFilteringActive, setIsFilteringActive] = useState(false);
  const initialViewRef = useRef({
    center: olProj.fromLonLat([0, 0]),
    zoom: 2
  });
  const storedLat = localStorage.getItem("userLat");
  const storedLng = localStorage.getItem("userLong");

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
      view: new View(initialViewRef.current)
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
      }
    };
  }, []);

  // Reset map to initial state
  const resetMap = useCallback(() => {
    if (!mapInstance.current) return;
    
    setIsFilteringActive(false);
    mapInstance.current.getView().animate({
      center: initialViewRef.current.center,
      zoom: initialViewRef.current.zoom
    });
  }, []);

  // Function to filter users within radius
  const filterUsersWithinRadius = (users, centerLon, centerLat, radiusKm) => {
    return users.filter(user => {
      const longitude = user.longitude || user.logitude;
      if (!longitude || !user.latitude) return false;

      const userLon = parseFloat(longitude);
      const userLat = parseFloat(user.latitude);

      if (isNaN(userLon) || isNaN(userLat)) return false;

      const distance = getDistance([centerLon, centerLat], [userLon, userLat]);
      return distance <= radiusKm * 1000;
    });
  };

  // Handle data changes and add markers
  useEffect(() => {
    if (!mapInstance.current || !data || data.length === 0) {
      setLoading(false);
      return;
    }

    const processUsers = async () => {
      setLoading(true);
      setSelectedUser(null);
      setPopupPosition(null);

      // Remove existing vector layer
      mapInstance.current.getLayers().forEach(layer => {
        if (layer instanceof VectorLayer) {
          mapInstance.current.removeLayer(layer);
        }
      });

      // Filter users with valid coordinates
      const validUsers = data.filter(user => {
        const longitude = user.longitude || user.logitude;
        if (!longitude || !user.latitude) return false;

        const lon = parseFloat(longitude);
        const lat = parseFloat(user.latitude);

        return !isNaN(lon) && !isNaN(lat) &&
               lat >= -90 && lat <= 90 &&
               lon >= -180 && lon <= 180;
      });

      if (validUsers.length === 0) {
        console.warn('No users with valid coordinates found');
        setLoading(false);
        return;
      }

      let usersToShow = validUsers;
      let centerLon, centerLat;
      let zoomLevel = 7;
      let hasStoredLocation = false;

      // Check if stored coordinates are available and valid
      if (storedLat && storedLng) {
        const parsedLat = parseFloat(storedLat);
        const parsedLng = parseFloat(storedLng);
      
        if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
          centerLon = parsedLng;
          centerLat = parsedLat;
          hasStoredLocation = true;
      
          const nearbyUsers = filterUsersWithinRadius(validUsers, centerLon, centerLat, 5);
      
          if (nearbyUsers.length > 0) {
            // usersToShow = nearbyUsers;
            zoomLevel = 12;
            setIsFilteringActive(true);
          } else {
            // DEFAULT TO ALL POINTS WHEN NONE FOUND IN 5KM RADIUS
            usersToShow = validUsers;
            setIsFilteringActive(false);
            zoomLevel = 5; // Zoom out to show all points
            
            // Calculate center from all users
            const coordinates = usersToShow.map(user => {
              const lon = parseFloat(user.longitude || user.logitude);
              const lat = parseFloat(user.latitude);
              return [lon, lat];
            });
            
            centerLon = coordinates.reduce((sum, [lon]) => sum + lon, 0) / coordinates.length;
            centerLat = coordinates.reduce((sum, [, lat]) => sum + lat, 0) / coordinates.length;
            zoomLevel = 3;
          }
        }
      }

      // If no stored location or invalid, show all points
      if (!hasStoredLocation) {
        const coordinates = usersToShow.map(user => {
          const longitude = user.longitude || user.logitude;
          return [parseFloat(longitude), parseFloat(user.latitude)];
        });

        centerLon = coordinates.reduce((sum, [lon]) => sum + lon, 0) / coordinates.length;
        centerLat = coordinates.reduce((sum, [, lat]) => sum + lat, 0) / coordinates.length;
        setIsFilteringActive(false);
      }

      // Create features
      const features = usersToShow.map(user => {
        const longitude = user.longitude || user.logitude;
        const lat = parseFloat(user.latitude);
        const lon = parseFloat(longitude);
        
        if (isNaN(lat) || isNaN(lon)) return null;

        const feature = new Feature({
          geometry: new Point(olProj.fromLonLat([lon, lat])),
          user: user
        });

        feature.setStyle(
          new Style({
            image: new Icon({
              anchor: [0.5, 1],
              src: '/assets/icons/loc.svg',
              scale: 0.8
            })
          })
        );

        return feature;
      }).filter(Boolean);

      if (features.length === 0) {
        console.warn('No valid features created');
        setLoading(false);
        return;
      }

      // Add vector layer
      const vectorLayer = new VectorLayer({
        source: new VectorSource({ features })
      });

      mapInstance.current.addLayer(vectorLayer);

      // Update view
      const center = olProj.fromLonLat([centerLon, centerLat]);
      initialViewRef.current = { center, zoom: zoomLevel };

      mapInstance.current.getView().setCenter(center);
      mapInstance.current.getView().setZoom(zoomLevel);

      mapInstance.current.getView().animate({
        center: center,
        zoom: zoomLevel,
        duration: 500
      });

      // Click handler
      const clickHandler = (evt) => {
        const feature = mapInstance.current.forEachFeatureAtPixel(
          evt.pixel,
          feature => feature
        );

        if (feature) {
          const user = feature.get('user');
          setSelectedUser(user);
          const pixel = mapInstance.current.getPixelFromCoordinate(evt.coordinate);
          setPopupPosition({
            left: pixel[0] + 'px',
            top: pixel[1] + 'px'
          });
        } else {
          setSelectedUser(null);
          setPopupPosition(null);
        }
      };

      // Pointer move handler
      const pointerMoveHandler = (evt) => {
        const hasFeature = mapInstance.current.forEachFeatureAtPixel(
          evt.pixel,
          () => true
        );
        mapInstance.current.getTargetElement().style.cursor = hasFeature ? 'pointer' : '';
      };

      mapInstance.current.on('click', clickHandler);
      mapInstance.current.on('pointermove', pointerMoveHandler);

      setLoading(false);

      return () => {
        if (mapInstance.current) {
          mapInstance.current.un('click', clickHandler);
          mapInstance.current.un('pointermove', pointerMoveHandler);
        }
      };
    };

    processUsers();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.getLayers().forEach(layer => {
          if (layer instanceof VectorLayer) {
            mapInstance.current.removeLayer(layer);
          }
        });
      }
    };
  }, [data, storedLat, storedLng]);

  return (
    <div className="relative w-full h-full cursor-pointer">
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />

      {/* Reset Map Button */}
      <button
        onClick={resetMap}
        className="absolute top-4 right-4 z-20 bg-white p-2 rounded shadow-md hover:bg-gray-100 transition"
        title="Reset Map"
      >
        Reset Map
      </button>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="text-white">Loading map...</div>
        </div>
      )}
     
      {selectedUser && popupPosition && (
        <div
                  className="absolute z-10 bg-white rounded-lg shadow-lg p-4 w-64 transform -translate-x-1/2"
                  style={{
                    left: popupPosition.left,
                    top: popupPosition.top
                  }}
                >
                  <div className="flex flex-col space-y-2">
                    <h3 className="font-bold text-lg">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    <CustomImage
                      alt=""
                      src={selectedUser.profileImage || '/assets/images/dumy.png'}
                      className="rounded-full h-8 w-8"
                    />
                    {selectedUser.email && <p className="text-gray-600">{selectedUser.email}</p>}
                    {selectedUser.city && <p className="text-gray-600">{selectedUser.city}</p>}
                    {selectedUser.country && <p className="text-gray-600">{selectedUser.country}</p>}
                    {selectedUser.phoneNumber && <p className="text-gray-600">{selectedUser.phoneNumber}</p>}
                  </div>
                </div>
      )}
    </div>
  );
};

export default OpenLayersMap;











































// 'use client';

// import { useCallback, useEffect, useRef, useState } from 'react';
// import 'ol/ol.css';
// import Map from 'ol/Map';
// import View from 'ol/View';
// import OSM from 'ol/source/OSM';
// import TileLayer from 'ol/layer/Tile';
// import VectorLayer from 'ol/layer/Vector';
// import * as olProj from 'ol/proj';
// import VectorSource from 'ol/source/Vector';
// import Feature from 'ol/Feature';
// import Point from 'ol/geom/Point';
// import { Style, Icon } from 'ol/style';
// import CustomImage from '../../shared/custom-image';

// const OpenLayersMap = ({ data, onViewChange }) => {
//   const mapRef = useRef(null);
//   const mapInstance = useRef(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [popupPosition, setPopupPosition] = useState(null);
//   const [isFilteringActive, setIsFilteringActive] = useState(false);
//   const initialViewRef = useRef({
//     center: olProj.fromLonLat([0, 0]),
//     zoom: 2
//   });

//   // Initialize the base map
//   useEffect(() => {
//     if (!mapRef.current) return;

//     mapInstance.current = new Map({
//       target: mapRef.current,
//       layers: [
//         new TileLayer({
//           source: new OSM()
//         })
//       ],
//       view: new View(initialViewRef.current)
//     });

//     return () => {
//       if (mapInstance.current) {
//         mapInstance.current.setTarget(undefined);
//       }
//     };
//   }, []);

//   // Handle view changes with debouncing
//   const handleViewChange = useCallback(() => {
//     if (!mapInstance.current || !isFilteringActive) return;

//     const view = mapInstance.current.getView();
//     const extent = view.calculateExtent(mapInstance.current.getSize());
    
//     const bottomLeft = olProj.toLonLat([extent[0], extent[1]]);
//     const topRight = olProj.toLonLat([extent[2], extent[3]]);

//     if (!bottomLeft || !topRight) return;

//     onViewChange({
//       minLon: Math.min(bottomLeft[0], topRight[0]),
//       minLat: Math.min(bottomLeft[1], topRight[1]),
//       maxLon: Math.max(bottomLeft[0], topRight[0]),
//       maxLat: Math.max(bottomLeft[1], topRight[1])
//     });
//   }, [isFilteringActive, onViewChange]);

//   // Reset map to initial state
//   const resetMap = useCallback(() => {
//     if (!mapInstance.current) return;
    
//     setIsFilteringActive(false);
//     mapInstance.current.getView().animate({
//       center: initialViewRef.current.center,
//       zoom: initialViewRef.current.zoom
//     });
//   }, []);

//   // Handle data changes and add markers
//   useEffect(() => {
//     if (!mapInstance.current || !data || data.length === 0) {
//       setLoading(false);
//       return;
//     }

//     const processUsers = async () => {
//       setLoading(true);
//       setSelectedUser(null);
//       setPopupPosition(null);

//       // Remove existing vector layer
//       mapInstance.current.getLayers().forEach(layer => {
//         if (layer instanceof VectorLayer) {
//           mapInstance.current.removeLayer(layer);
//         }
//       });

//       // Filter users with valid coordinates
//       const validUsers = data.filter(user => {
//         const longitude = user.longitude || user.logitude;
//         if (!longitude || !user.latitude) return false;

//         const lon = parseFloat(longitude);
//         const lat = parseFloat(user.latitude);

//         return !isNaN(lon) && !isNaN(lat) &&
//                lat >= -90 && lat <= 90 &&
//                lon >= -180 && lon <= 180;
//       });

//       if (validUsers.length === 0) {
//         console.warn('No users with valid coordinates found');
//         setLoading(false);
//         return;
//       }

//       // Create features
//       const features = validUsers.map(user => {
//         const longitude = user.longitude || user.logitude;
//         const feature = new Feature({
//           geometry: new Point(
//             olProj.fromLonLat([parseFloat(longitude), parseFloat(user.latitude)])
//           ),
//           user: user
//         });

//         feature.setStyle(
//           new Style({
//             image: new Icon({
//               anchor: [0.5, 1],
//               src: '/assets/icons/loc.svg',
//               scale: 0.8
//             })
//           })
//         );

//         return feature;
//       });

//       // Add vector layer
//       const vectorLayer = new VectorLayer({
//         source: new VectorSource({ features })
//       });

//       mapInstance.current.addLayer(vectorLayer);

//       // Calculate center point
//       const coordinates = validUsers.map(user => {
//         const longitude = user.longitude || user.logitude;
//         return [parseFloat(longitude), parseFloat(user.latitude)];
//       });

//       const centerLon = coordinates.reduce((sum, [lon]) => sum + lon, 0) / coordinates.length;
//       const centerLat = coordinates.reduce((sum, [, lat]) => sum + lat, 0) / coordinates.length;

//       // Update initial view ref with calculated center
//       initialViewRef.current = {
//         center: olProj.fromLonLat([centerLon, centerLat]),
//         zoom: 4
//       };

//       mapInstance.current.getView().animate(initialViewRef.current);
//       setIsFilteringActive(true);

//       // Click handler
//       const clickHandler = (evt) => {
//         const feature = mapInstance.current.forEachFeatureAtPixel(
//           evt.pixel,
//           feature => feature
//         );

//         if (feature) {
//           const user = feature.get('user');
//           setSelectedUser(user);
//           const pixel = mapInstance.current.getPixelFromCoordinate(evt.coordinate);
//           setPopupPosition({
//             left: pixel[0] + 'px',
//             top: pixel[1] + 'px'
//           });
//         } else {
//           setSelectedUser(null);
//           setPopupPosition(null);
//         }
//       };

//       // Pointer move handler
//       const pointerMoveHandler = (evt) => {
//         const hasFeature = mapInstance.current.forEachFeatureAtPixel(
//           evt.pixel,
//           () => true
//         );
//         mapInstance.current.getTargetElement().style.cursor = hasFeature ? 'pointer' : '';
//       };

//       mapInstance.current.on('click', clickHandler);
//       mapInstance.current.on('pointermove', pointerMoveHandler);
//       mapInstance.current.on('moveend', handleViewChange);

//       setLoading(false);

//       return () => {
//         if (mapInstance.current) {
//           mapInstance.current.un('click', clickHandler);
//           mapInstance.current.un('pointermove', pointerMoveHandler);
//           mapInstance.current.un('moveend', handleViewChange);
//         }
//       };
//     };

//     processUsers();

//     return () => {
//       if (mapInstance.current) {
//         mapInstance.current.getLayers().forEach(layer => {
//           if (layer instanceof VectorLayer) {
//             mapInstance.current.removeLayer(layer);
//           }
//         });
//       }
//     };
//   }, [data, handleViewChange]);

//   return (
//     <div className="relative w-full sm:h-full h-[40vh]">
//       <div
//         ref={mapRef}
//         className="w-full h-full"
//         style={{ minHeight: '400px' }}
//       />

//       {/* Reset Map Button */}
//       <button
//         onClick={resetMap}
//         className="absolute top-4 right-4 z-20 bg-white p-2 rounded shadow-md hover:bg-gray-100 transition"
//         title="Reset Map"
//       >
//         Reset Map
//       </button>

//       {selectedUser && popupPosition && (
//         <div
//           className="absolute z-10 bg-white rounded-lg shadow-lg p-4 w-64 transform -translate-x-1/2"
//           style={{
//             left: popupPosition.left,
//             top: popupPosition.top
//           }}
//         >
//           <div className="flex flex-col space-y-2">
//             <h3 className="font-bold text-lg">
//               {selectedUser.firstName} {selectedUser.lastName}
//             </h3>
//             <CustomImage
//               alt=""
//               src={selectedUser.profileImage || '/assets/images/dumy.png'}
//               className="rounded-full h-8 w-8"
//             />
//             {selectedUser.email && <p className="text-gray-600">{selectedUser.email}</p>}
//             {selectedUser.city && <p className="text-gray-600">{selectedUser.city}</p>}
//             {selectedUser.country && <p className="text-gray-600">{selectedUser.country}</p>}
//             {selectedUser.phoneNumber && <p className="text-gray-600">{selectedUser.phoneNumber}</p>}
//           </div>
//         </div>
//       )}

//       {loading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-[#0000005d] bg-opacity-30">
//           <div className="text-white font-semibold">Loading map...</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OpenLayersMap;