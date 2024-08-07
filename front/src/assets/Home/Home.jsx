import React, { useEffect, useState } from 'react';
import '../CSS/Style.css'; 
import { FaTemperatureHigh } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { FaCloudRain } from "react-icons/fa";

const Home = () => {
  const [search, setSearch] = useState("Jaipur");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [dailyForecast, setDailyForecast] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); 

  useEffect(() => {
    const fetchWeatherData = async () => {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=2d1ee743b6e44a6c6f47bd48223b03af&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${search}&appid=2d1ee743b6e44a6c6f47bd48223b03af&units=metric`;

      // Reset error message
      setErrorMessage("");

      try {
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) throw new Error('City not found');
        const weatherData = await weatherResponse.json();

        setCurrentWeather({
          temperature: weatherData.main.temp,
          humidity: weatherData.main.humidity,
          chanceOfRain: weatherData.rain ? weatherData.rain["1h"] : 0,
          weatherDescription: weatherData.weather[0].description,
          cityName: weatherData.name
        });

        // Fetch forecast data
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) throw new Error('City not found');
        const forecastData = await forecastResponse.json();

        const dailyOverview = forecastData.list.slice(0, 8).map(item => ({
          time: item.dt_txt,
          weather: item.weather[0].description,
          temperature: item.main.temp
        }));
        setDailyForecast(dailyOverview);

      } catch (error) {
        setCurrentWeather(null);
        setDailyForecast(null);
        setErrorMessage(error.message); 
      }
    };

    fetchWeatherData();
  }, [search]);

  return (
    <div className="main-container">
      <h1>Weather Information</h1>
      <div className="weather-info">
        <div className='input_search'>
          <input
            type="search"
            placeholder="Search city"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>} 
        {currentWeather && !errorMessage ? (
          <div className="weather-details">
            <div className='temp'>
              <p><FaTemperatureHigh /> {currentWeather.temperature}°C</p>
            </div>
            <div className='humid'>
              <p><WiHumidity /> {currentWeather.humidity}%</p>
            </div>
            <div className='rain'>
              <p><FaCloudRain /> {currentWeather.chanceOfRain} mm</p>
            </div>
            <div className='weather-description'>
              <p>{currentWeather.weatherDescription}</p>
            </div>
          </div>
        ) : !errorMessage ? (
          <p>Loading...</p>
        ) : null}
      </div>
      {dailyForecast && !errorMessage && (
        <div className="daily-overview">
          <h2>Today's Weather in: <span className='city'>{currentWeather.cityName}</span></h2>
          <ul>
            {dailyForecast.map((item, index) => (
              <li key={index}>
                <strong>{item.time}:</strong> {item.weather}, {item.temperature}°C
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
