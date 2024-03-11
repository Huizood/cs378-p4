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
      const d = await response.json();
      const locations = d.results?.[0] ?? null;
      if (!locations) {
        console.log("LOCATION NOT FOUND");
        return null;
      }
      const { latitude, longitude } = locations;
      return { latitude, longitude };
    } catch (error) {
      setError('LOCATION NOT FOUND');
      console.error('Geo error:', error);
      return null;
    }
  };

  const weatherFetch = async (city) => {
    try {
      const locations = await geocoding(city);
      if (!locations) {
        console.log("LOCATION NOT FOUND");
        return null;
      }
      const fetchWea = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${locations.latitude}&longitude=${locations.longitude}&current=temperature_2m&hourly=temperature_2m&temperature_unit=fahrenheit&timezone=auto&daily=temperature_2m_max,temperature_2m_min`);
      const weaData = await fetchWea.json();

      return { ...weaData, name: city };
    } catch (error) {
      setError("ERROR OF FETCH");
      console.error("ERROR OF FETCHING", error);
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
      setError('Error: City not found');
      console.error('handle error: CITY NOT FOUND', error);
      return null;
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
        setError('ERROR');
        console.error('Error:Click', error);
      }
    }
  };

  const renderWeatherData = () => {
    if (cities) {
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
          {cities.hourly &&
            cities.hourly.time &&
            cities.hourly.temperature_2m &&
            cities.hourly.time.slice(0, 10).map((time, index) => (
              <Render
                key={index}
                temp={cities.hourly.temperature_2m[index]}
                time={time}
                index={index}
              />
            ))}
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    // Fetch weather data for Austin when component mounts
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
