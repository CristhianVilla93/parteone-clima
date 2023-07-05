'use client'

import React, { useState } from 'react';

const Clima = () => {
  const [city, setCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  const fetchData = async () => {
    try {
      const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8087ec1c35c0186373f21276aa07faa0&units=metric`
      );
      if (!currentWeatherResponse.ok) {
        throw new Error('Current weather not found');
      }
      const currentWeatherData = await currentWeatherResponse.json();
      setCurrentWeather(currentWeatherData);
      setError(null);

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=8087ec1c35c0186373f21276aa07faa0&units=metric`
      );
      if (!forecastResponse.ok) {
        throw new Error('Forecast not found');
      }
      const forecastData = await forecastResponse.json();
      const forecastAt9AM = forecastData.list.filter(
        (item) => item.dt_txt.endsWith('09:00:00')
      );
      setForecast(forecastAt9AM);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setCurrentWeather(null);
      setForecast(null);
      setError(error.message);
    }
  };

  const getWeatherIconUrl = (iconCode) =>
    `http://openweathermap.org/img/wn/${iconCode}.png`;

  return (
    <div className="principal">
      <div className="secund1">
        <input type="text" value={city} onChange={handleInputChange} />
        <button onClick={fetchData}>Search</button>
        {error && <p>{error}</p>}
        {currentWeather && (
          <div>
            
            <p>Temperatura: {currentWeather.main.temp} °C</p>
            {currentWeather.weather.map((weather) => (
              <div key={weather.id}>
                <img
                  src={getWeatherIconUrl(weather.icon)}
                  alt={weather.description}
                />
                <p>{weather.description}</p>
              </div>

            ))}
          </div>
        )}
      </div>
      <div className="secund2">
        {forecast && (
          <>
            {forecast.map((item) => (
              <div key={item.dt} className="cuadromayor">
                <div className="cuadroDias">
                  <div className='dias'>
                    <p>Dia {item.dt_txt.substring(8, 10)} Jul</p>
                    {item.weather.map((weather) => (
                      <div key={weather.id}>
                        <img
                          src={getWeatherIconUrl(weather.icon)}
                          alt={weather.description}
                        />
                      </div>
                    ))}
                    <p>Temperature: {item.main.temp} °C</p>
                  </div>
                </div>
                <div className="cuadroDatos">
                  <div className="datos">
                    <p>velocidad: {item.wind.speed}</p>
                    <p>humedad: {item.main.humidity}</p>
                    <p>visibility: {item.main.visibility}</p>
                    <p>Aire: {item.main.pressure}</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Clima;
