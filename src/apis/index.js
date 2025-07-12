//all api calls made in this file by axios

import axios from 'axios';
const URL_RESTAURANTS = "https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary";
const URL_HOTELS = "https://travel-advisor.p.rapidapi.com/hotels/list-in-boundary";
const URL_ATTRACTIONS = "https://travel-advisor.p.rapidapi.com/attractions/list-in-boundary";

// Add verification for environment variables
if (!import.meta.env.VITE_RAPIDAPI_TRAVEL_API_KEY) {
    console.error('API key is missing! Check your .env file');
}

// Add rate limiting configuration
const axiosInstance = axios.create({
    headers: {
        'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_TRAVEL_API_KEY,
        'x-rapidapi-host': import.meta.env.VITE_RAPIDAPI_HOST
    }
});

// Debug log to verify headers
console.log('Headers being sent:', axiosInstance.defaults.headers);


// Add request queue
let requestQueue = Promise.resolve();
const DELAY_BETWEEN_REQUESTS = 1000; // 1 second delay


const getPlacesData = async (type, sw, ne) => {
    let url;
    switch (type) {
        case 'restaurants':
            url = URL_RESTAURANTS;
            break;
        case 'hotels':
            url = URL_HOTELS;
            break;
        case 'attractions':
            url = URL_ATTRACTIONS;
            break;
        default:
            url = URL_RESTAURANTS;
    }

    try {
        // Queue the request
        await requestQueue;
        requestQueue = requestQueue.then(() => new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS)));

        const response = await axiosInstance.get(url, {
            params: {
                bl_latitude: sw[0],
                tr_latitude: ne[0],
                bl_longitude: sw[1],
                tr_longitude: ne[1],
                limit: 30,
            },
        });
        if (response.status === 200 && response.data.data) {
            return response.data.data;
        } else {
            console.warn('API response format unexpected:', response);
            return [];
        }
    } catch (error) {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    console.error('API Key invalid or missing');
                    break;
                case 429:
                    console.error('Rate limit exceeded - too many requests');
                    break;
                default:
                    console.error(`API Error: ${error.response.status}`, error.message);
            }
        } else {
            console.error('Network or other error:', error.message);
        }
        return [];
    }
};

const getWeatherData = async (lat, lon) => {
    try {
        const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
            params: {
                latitude: lat,
                longitude: lon,
                current_weather: true
            },
        });
        return response.data;
    } catch (err) {
        console.error("Error fetching weather:", err);
        return null;
    }
};


export { getPlacesData, getWeatherData };