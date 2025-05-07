export const geocodeUser = async (user) => {
    try {
        const query = [
            user.city,
            user.state,
            user.country,
            user.zipCode
        ].filter(Boolean).join(', ');

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
            {
                headers: {
                    'User-Agent': 'ALS'
                }
            }
        );

        const data = await response.json();
        if (data.length > 0) {
            return {
                ...user,
                latitude: data[0].lat,
                logitude: data[0].lon
            };
        }
    } catch (error) {
        console.error('Geocoding failed for user:', user, error);
    }
    return user; // Return original if geocoding fails
};