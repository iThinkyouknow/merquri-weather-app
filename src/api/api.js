import { unitType } from '../constants/constants';
export async function callWeatherAPI(searchText) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchText.trim()}&units=${unitType}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`);
    const data = await res.json();

    return data;
}