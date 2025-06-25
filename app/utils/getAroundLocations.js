export async function generateNearbyLocations(userLat, userLng, radiusKm = 15) {
    // Validate input coordinates
    if (!userLat || !userLng || isNaN(userLat) || isNaN(userLng)) {
        throw new Error("Invalid latitude or longitude values");
    }

    // Convert radius from kilometers to radians (Earth's radius ~6371 km)
    const earthRadiusKm = 6371;
    const radiusRad = radiusKm / earthRadiusKm;

    // Generate 6 points evenly distributed around the user (60-degree intervals)
    const locations = [];
    const angles = [0, 60, 120, 180, 240, 300]; // Degrees for 6 points in a circle

    for (const [index, angle] of angles.entries()) {
        // Convert angle to radians
        const angleRad = (angle * Math.PI) / 180;

        // Calculate new latitude and longitude
        const latRad = (userLat * Math.PI) / 180;
        const lngRad = (userLng * Math.PI) / 180;

        // Calculate new coordinates using spherical geometry
        const newLatRad = Math.asin(
            Math.sin(latRad) * Math.cos(radiusRad) +
            Math.cos(latRad) * Math.sin(radiusRad) * Math.cos(angleRad)
        );
        const newLngRad = lngRad + Math.atan2(
            Math.sin(angleRad) * Math.sin(radiusRad) * Math.cos(latRad),
            Math.cos(radiusRad) - Math.sin(latRad) * Math.sin(newLatRad)
        );

        // Convert back to degrees
        const newLat = (newLatRad * 180) / Math.PI;
        const newLng = (newLngRad * 180) / Math.PI;

        // Fetch real address using Nominatim
        let address = `Location ${index + 1}, ${radiusKm}km from user`; // Fallback
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}&zoom=10&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'YourAppName/1.0 (contact@example.com)', // Replace with your app name and contact
                    },
                }
            );
            const data = await response.json();
            if (data && data.display_name) {
                address = data.display_name; // e.g., "Johar Town, Lahore, Punjab, Pakistan"
            }
        } catch (error) {
            console.error(`Error fetching address for location ${index + 1}:`, error.message);
        }

        locations.push({
            latitude: newLat.toString(), // Convert to string to match your boardData format
            longitude: newLng.toString(),
            address: address,
        });
    }

    return locations;
}
