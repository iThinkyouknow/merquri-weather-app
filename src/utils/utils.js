import {format} from 'date-fns';
import { localStorageSavedSearchHistoryKey, queryKey } from '../constants/constants';

export function getSavedSearchHistoryFromLocalStorage() {
    const savedSearchHistory = localStorage.getItem(localStorageSavedSearchHistoryKey);
    return savedSearchHistory
        ? JSON.parse(savedSearchHistory)
        : {};
}

export function saveSearchHistoryToLocalStorage(searchHistory) {
    try {
        localStorage.setItem(localStorageSavedSearchHistoryKey, JSON.stringify(searchHistory));
    } catch (error) {
        console.error(error);
    }
}

export function getQueryString() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get(queryKey) || '';

    return query;
}

const url = new URL(location.href);

export function setQueryParams(query) {
  url.searchParams.set(queryKey, query);
  history.replaceState(null, '', url);
}

export function generateLocationName(city, countryCode) {
  return `${city}, ${countryCode}`;
}

export function formatDateTime(timestamp) {
  return format(timestamp * 1000, 'dd-MM-yyyy hh:mmaaa');
}

export function checkIsDay(searchResults) {
    return [searchResults.sys.sunset - searchResults.dt, searchResults.dt - searchResults.sys.sunrise].every(num => num > 0);
  }