
import { useState } from 'react';
import { format } from 'date-fns';
import './App.css';
import { FaSistrix, FaTrash } from "react-icons/fa";
import cloudImg from './assets/cloud.png';
import sunImg from './assets/sun.png';

//todo
// empty state √
// day/night √
// not found state √
// refactor
// desktop √

const localStorageKey = 'savedSearchHistory';
const _savedSearchHistory = localStorage.getItem(localStorageKey);
const savedSearchHistory = _savedSearchHistory
  ? JSON.parse(_savedSearchHistory)
  : {};

const unitType = navigator.language === 'en-US'
  ? 'imperial'
  : 'metric';

const statusCodes = {
  ok: 200,
  notFound: 404
};

function generateLocationName(city, countryCode) {
  return `${city}, ${countryCode}`;
}

function formatDateTime(timestamp) {
  return format(timestamp * 1000, 'dd-MM-yyyy hh:mmaaa');
}

function App() {

  const [searchText, setSearchText] = useState('');
  const [weatherData, setWeatherData] = useState({});
  const [searchHistory, setSearchHistory] = useState(savedSearchHistory);
  const [isDay, setIsDay] = useState(true);

  function checkIsDay(searchResults) {
    return [searchResults.sys.sunset - searchResults.dt, searchResults.dt - searchResults.sys.sunrise].every(num => num > 0);
  }

  const img = isDay ? sunImg : cloudImg;

  const locationName = weatherData.sys ? generateLocationName(weatherData.name, weatherData.sys.country) : '';
  const dateFormatted = weatherData.dt
    ? formatDateTime(weatherData.dt)
    : '';

  function onSearchTextChange(event) {
    setSearchText(event.target.value);
  }

  function saveToLocalStorage(searchHistory) {
    try {
      localStorage.setItem(localStorageKey, JSON.stringify(searchHistory));
    } catch (error) {
      console.log(error);
    }
  }

  function addToSearchHistory(searchResults) {
    const newSearchHistory = {
      ...searchHistory,
      [generateLocationName(searchResults.name, searchResults.sys.country)]: ~~(Date.now() / 1000)
    };
    setSearchHistory(newSearchHistory);

    saveToLocalStorage(newSearchHistory);
  }

  function removeFromSearchHistory(name) {
    return () => {
      const newSearchHistory = { ...searchHistory };
      newSearchHistory[name] = undefined;
      setSearchHistory(newSearchHistory);

      saveToLocalStorage(newSearchHistory);
    }
  }

  function onSearch(e) {
    e.preventDefault();
    if (!searchText) {
      alert('Give me something to search!')
      return;
    }
    callWeatherAPI(searchText)();
  }

  function callWeatherAPI(searchText) {
    return async () => {
      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchText.trim()}&units=${unitType}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`);
        const data = await res.json();
        if (data.cod === statusCodes.ok) {
          addToSearchHistory(data);
          setIsDay(checkIsDay(data))
          setSearchText('');
        }
        setWeatherData(data);
      } catch (error) {
        alert(error);
      }
    }
  }


  const searchLabelDynamicClass = searchText
    ? `-top-0.5 text-3xs sm:text-sm sm:top-1`
    : `top-3.5 text-xs sm:text-base sm:top-5`

  const SearchHistoryList = Object.entries(searchHistory)
    .filter(([_, timestamp]) => timestamp)
    .sort((a, b) => b[1] - a[1])
    .map(([name, timestamp]) => {
      const formattedDateTime = formatDateTime(timestamp);
      return (
        <li key={name} className='flex rounded justify-between rounded-2xl bg-1A1A1A/50 p-3 sm:p-6 pr-4 gap-4'>
          <div className='flex flex-col sm:items-center sm:flex-row sm:justify-between sm:flex-1'>
            <span className='font-bold sm:font-normal'>{name}</span>
            <span className='text-white/50 text-2xs sm:text-base'>{formattedDateTime}</span>
          </div>
          <div className='flex gap-2 justify-center items-center'>
            <button className='flex justify-center items-center rounded-full border border-2 border-white/40 h-8 w-8 hover:scale-105' onClick={callWeatherAPI(name)}>
              <FaSistrix className="text-white/40" />
            </button>
            <button className='flex justify-center items-center rounded-full border border-2 border-white/40 h-8 w-8 hover:scale-105' onClick={removeFromSearchHistory(name)}>
              <FaTrash className="text-white/40" />
            </button>

          </div>
        </li>
      )
    });

  return (
    <div className="App bg w-screen min-h-screen flex flex-col p-4 text-white text-sm sm:text-base items-center relative">
      <div className='absolute left-0 top-0 z-0 w-full h-full bg animate-bg'></div>
      <div id='width-container' className='w-full h-full sm:max-w-3xl flex flex-col z-20' >
        <section id="search-section" className="flex justify-center items-center w-full">
          <div className="flex h-10	w-full sm:h-16">
            <form onSubmit={onSearch} className='flex w-full gap-2 sm:gap-6'>
              <div id="search-input-container" className='flex-1 h-full relative' >
                <label htmlFor="search-input" className={`transition-all absolute left-2 sm:left-4 text-white/40 ${searchLabelDynamicClass}`}>Country</label>
                <input id="search-input" type="text" className='flex items-center bg-1A1A1A/50 h-full rounded rounded-lg sm:rounded-2xl p-2 sm:p-4 w-full text-xs sm:text-base' value={searchText} onChange={onSearchTextChange} />
              </div>
              <button type="button" className="flex justify-center items-center bg-28124D w-10 rounded rounded-lg hover:scale-105 h-full sm:w-16 sm:rounded-3xl" onClick={onSearch} >
                <FaSistrix className="text-xl sm:text-3xl" />
              </button>
            </form>
          </div>
        </section>
        <main className='mt-32 bg-1A1A1A/30 h-full rounded rounded-2xl sm:rounded-3xl flex flex-col gap-4 p-6 sm:p-12'>
          <section id="weather-results" className='flex flex-col gap-1 relative'>
            <img src={img} alt="clouds day or night" className='absolute w-44 -right-4 -top-24 animate-cloud-img sm:w-72 sm:-top-36' />
            <div>
              <h2>
                Today's Weather
              </h2>
            </div>
            {weatherData.cod === statusCodes.ok && weatherData.main && (
              <>
                <div className='flex justify-between sm:justify-start'>
                  <div className='left flex flex-col sm:shrink sm:flex-none sm:w-48 sm:overflow-visible sm:flex-nowrap'>
                    <h2 className='text-6xl sm:text-8xl font-semibold'>{weatherData.main.temp}°</h2>
                    <div className='flex gap-2'>
                      <span>H: {weatherData.main.temp_max}°</span>
                      <span>L: {weatherData.main.temp_min}°</span>
                    </div>
                    <span className='font-bold'>{locationName}</span>
                  </div>
                  <div className='right flex flex-col sm:flex-row-reverse justify-end sm:items-end sm:gap-4 text-righ sm:justify-between sm:flex-1'>
                    <span>{weatherData.weather?.[0]?.main}</span>
                    <span>Humidity: {weatherData.main.humidity}%</span>
                    <span className=''>{dateFormatted}</span>
                  </div>
                </div>
              </>
            )
            }
            {weatherData.cod && weatherData.cod !== statusCodes.ok && (
              <span className='text-2xl max-w-[70%] inline-block'>No weather data for country</span>
            )}
            {!weatherData.cod && (
              <span className='text-2xl max-w-[70%] inline-block'>Search for a country to begin!</span>
            )}
          </section>
          {/*  */}
          <section id="search-history" className='mt-2 flex-1 rounded rounded-2xl bg-1A1A1A/30 py-6 px-4 sm:px-6 '>
            <h2>Search History</h2>

            <ul id='search-history-list' className='mt-6 flex flex-col gap-4'>
              {SearchHistoryList}
            </ul>
          </section>
        </main>
      </div>
    </div>


  );
}

export default App;
