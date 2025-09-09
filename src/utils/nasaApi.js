// utils/nasaApi.js
import axios from 'axios';

const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY;
const NASA_BASE_URL = 'https://api.nasa.gov';

// Create axios instance with default params
const nasaApi = axios.create({
  baseURL: NASA_BASE_URL,
  timeout: 10000,
});

// Request interceptor to automatically add API key
nasaApi.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    api_key: NASA_API_KEY,
  };
  return config;
});

export const getApodData = () => {
  return nasaApi.get('/planetary/apod');
};

export const getAsteroidData = (startDate, endDate) => {
  return nasaApi.get('/neo/rest/v1/feed', {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });
};

export const getMarsWeather = () => {
  return nasaApi.get('/insight_weather/');
};