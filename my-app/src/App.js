import React, { useState, useEffect } from 'react';
import Render from './components/Render';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [cities, setCity] = useState(null);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  const geocoding = async (city) => {
    try {
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
      const data = await response.json();
      const locations = data.results?.[0] ?? null;

      if (!locations) {
        console.log('LOCATION NOT FOUND');
        return null;
      }

      const { latitude, longitude } = locations;
      return { latitude, longitude };
    } catch (error) {
      setError('LOCATION NOT FOUND' + error.message);
      console.error('Geocoding error:', error);
      return null;
    }
  };

  const weatherFetch = async (city) => {
    try {
      const locations = await geocoding(city);
  
      if (!locations) {
        console.log('LOCATION NOT FOUND');
      }
  
      const fetchWeather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${locations.latitude}&longitude=${locations.longitude}&current=temperature_2m&hourly=temperature_2m&temperature_unit=fahrenheit&timezone=auto&daily=temperature_2m_max,temperature_2m_min`);
      
      if (!fetchWeather.ok) {
        console.log('ERROR OF FETCH');
        throw new Error('Error fetching weather data');
      }
  
      const weatherData = await fetchWeather.json();
  
      return { ...weatherData, name: city };
    } catch (error) {
      setError('LOCATION NOT FOUND' + error.message);
      console.error('Error fetching weather data:', error);
      return null;
    }
  };

  const handleCityButtonClick = async (city) => {
    try {
      const data = await weatherFetch(city);

      if (data !== null) {
        setCity(data);
      }
    } catch (error) {
      setError('Error: City not found' + error.message);
      console.error('Handle error: CITY NOT FOUND', error);
    }
  };

  const handleSearchButtonClick = async () => {
    if (searchInput.trim() !== '') {
      try {
        const data = await weatherFetch(searchInput.trim());
  
        if (data !== null) {
          setCity(data);
        }
      } catch (error) {
        setError(`Latitude and longitude for ${searchInput} not found! Please enter a valid city name.`);
        console.error('Error clicking search button:', error);
      }
    }
  };
  

  const renderWeatherData = () => {
    if (cities) {
      const { hourly, current } = cities;

      return (
        <div className="Container">
          <div className="row">
            <div className="col-3">
              <p>Temperature </p>
            </div>
            <div className="col-3">
              <p>Time </p>
            </div>
          </div>
          {hourly && hourly.time && hourly.temperature_2m && hourly.time.slice(0, 10).map((time, index) => (
            <Render
              key={index}
              temp={hourly.temperature_2m[index]}
              time = {time}
            />
          ))}
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    // Fetch weather data for Austin when the component mounts
    handleCityButtonClick('Austin');
  }, []); // Empty dependency array ensures it only runs once on mount

  return (
    <div className="App">
      {error && <p>{error}</p>}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter city name"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          className="btn btn-outline-secondary mt-2"
          type="button"
          onClick={handleSearchButtonClick}
        >
          Search
        </button>
      </div>
      <div className="Container">
        <div className="row">
          <div className="col-3">
            <button
              className={`btn btn-outline-secondary mt-2 ${cities && cities.name === 'Austin' ? 'active' : ''}`}
              onClick={() => handleCityButtonClick('Austin')}
            >
              Austin
            </button>
          </div>
          <div className="col-3">
            <button
              className={`btn btn-outline-secondary mt-2 ${cities && cities.name === 'Dallas' ? 'active' : ''}`}
              onClick={() => handleCityButtonClick('Dallas')}
            >
              Dallas
            </button>
          </div>
          <div className="col-3">
            <button
              className={`btn btn-outline-secondary mt-2 ${cities && cities.name === 'Houston' ? 'active' : ''}`}
              onClick={() => handleCityButtonClick('Houston')}
            >
              Houston
            </button>
          </div>
        </div>
      </div>
      {renderWeatherData()}
    </div>
  );
};

export default App;

