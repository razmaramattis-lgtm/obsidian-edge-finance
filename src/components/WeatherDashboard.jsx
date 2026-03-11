import React from 'react';
import WeatherCard from './WeatherCard';
import useWeather from './useWeather';
import './styles.css';

const WeatherDashboard = () => {
    const { data, loading, error } = useWeather();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="dashboard">
            {data.map((weather) => (
                <WeatherCard key={weather.id} weather={weather} />
            ))}
        </div>
    );
};

export default WeatherDashboard;