import { create } from 'zustand';
import { getHumid } from './humid';
import { getTemp } from './temp';
import getWeatherData from './weather'; 

const useDataStore = create((set) => ({
  data: { humid: [], temp: [], weather: null },

  fetchHumidityStream: () => {
    getHumid((data) => {
      if (data.humid) {
        set((state) => ({
          data: {
            ...state.data,
            humid: data.humid,
          },
        }));
      }
    });
  },

  fetchTemperatureStream: () => {
    getTemp((data) => {
      if (data.temp) {
        set((state) => ({
          data: {
            ...state.data,
            temp: data.temp,
          },
        }));
      }
    });
  },

  fetchWeatherData: async () => {
    try {
      await getWeatherData((data) => {
        if (data.temperature && data.humidity) {
          set((state) => ({
            data: {
              ...state.data,
              weather: {
                temperature: data.temperature,
                humidity: data.humidity,
                windSpeed: data.windSpeed,
                temperatureApparent: data.temperatureApparent,
                weatherCondition: data.weatherCondition,
                uvIndex: data.uvIndex,
                time: data.time,
              },
            },
          }));
          console.log('Weather data successfully set in the store:', data);
        } else {
          console.log('Invalid weather data received:', data);
        }
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  },
}));

export default useDataStore;
