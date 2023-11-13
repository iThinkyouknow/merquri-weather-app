
import { useEffect, useState } from 'react';
import './App.css';
import { FaSistrix } from "react-icons/fa";
import cloudImg from './assets/cloud.png';
import sunImg from './assets/sun.png';
import { SearchHistory } from './components/SearchHistory';
import { SearchBar } from './components/SearchBar';
import { RoundSquareBtn } from './components/RoundSquareBtn';
import { NoDataInfoText } from './components/NoDataInfoText';
import {
  getSavedSearchHistoryFromLocalStorage,
  saveSearchHistoryToLocalStorage,
  getQueryString,
  setQueryParams,
  generateLocationName,
  formatDateTime,
  checkIsDay
} from './utils/utils';
import { statusCodes } from './constants/constants';
import { callWeatherAPI } from './api/api';

const savedSearchHistory = getSavedSearchHistoryFromLocalStorage()

const query = getQueryString();

function App() {

  const [searchText, setSearchText] = useState(query);
  const [weatherData, setWeatherData] = useState({});
  const [searchHistory, setSearchHistory] = useState(savedSearchHistory);
  const [isDay, setIsDay] = useState(true);

  let hasCalled = false; // react in dev mode will call useEffect twice
  useEffect(() => {
    if (query && !hasCalled) {
      callWeatherAPIAndHandle(query)();
    }

    return () => {
      hasCalled = true;
    }
  }, []);

  const img = isDay ? sunImg : cloudImg;

  const locationName = weatherData.sys ? generateLocationName(weatherData.name, weatherData.sys.country) : '';
  const dateFormatted = weatherData.dt
    ? formatDateTime(weatherData.dt)
    : '';

  function onSearchTextChange(event) {
    const value = event.target.value;
    setSearchText(value);
    setQueryParams(value);
  }

  function addToSearchHistory(searchResults) {
    const newSearchHistory = {
      ...searchHistory,
      [generateLocationName(searchResults.name, searchResults.sys.country)]: ~~(Date.now() / 1000)
    };
    setSearchHistory(newSearchHistory);

    saveSearchHistoryToLocalStorage(newSearchHistory);
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
    callWeatherAPIAndHandle(searchText)();
  }

  function callWeatherAPIAndHandle(searchText) {
    return async () => {
      try {
        const data = await callWeatherAPI(searchText);
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

  const SearchHistoryList = Object.entries(searchHistory)
    .filter(([_, timestamp]) => timestamp)
    .sort((a, b) => b[1] - a[1])
    .map(([name, timestamp]) => {
      const formattedDateTime = formatDateTime(timestamp);
      return (
        <SearchHistory key={name} name={name} formattedDateTime={formattedDateTime} onSearch={callWeatherAPIAndHandle(name)} onDelete={removeFromSearchHistory(name)} />
      )
    });

  function NoDataText() {
    let text = ''
    if (weatherData.cod && weatherData.cod !== statusCodes.ok) {
      text = 'No weather data for country'
    } else if (!weatherData.cod) {
      text = 'Search for a country to begin!'
    }

    return text
      ? (<NoDataInfoText extraClass={'max-w-[70%]'}>{text}</NoDataInfoText>)
      : null;
  }

  return (
    <div className="App bg w-screen min-h-screen flex flex-col p-4 text-white text-sm sm:text-base items-center relative">
      <div className='absolute left-0 top-0 z-0 w-full h-full bg animate-bg'></div>
      <div id='width-container' className='w-full h-full sm:max-w-3xl flex flex-col z-20' >
        <section id="search-section" className="flex justify-center items-center w-full">
          <div className="flex h-10	w-full sm:h-16">
            <form onSubmit={onSearch} className='flex w-full gap-2 sm:gap-6'>
              <SearchBar className={'flex-1 h-full relative'} label={'Country'} onChange={onSearchTextChange} value={searchText}></SearchBar>
              <RoundSquareBtn onClick={onSearch}>
                <FaSistrix className="text-xl sm:text-3xl" />
              </RoundSquareBtn>
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
                    <span>{dateFormatted}</span>
                  </div>
                </div>
              </>
            )
            }
            {NoDataText()}
          </section>
          {/*  */}
          <section id="search-history" className='mt-2 flex-1 rounded rounded-2xl bg-1A1A1A/30 py-6 px-4 sm:px-6 '>
            <h2>Search History</h2>
            <ul id='search-history-list' className='mt-6 flex flex-col gap-4'>
              {
                SearchHistoryList.length
                  ? SearchHistoryList
                  : <NoDataInfoText>No Record</NoDataInfoText >
              }
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
