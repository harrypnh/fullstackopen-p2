import { useState, useEffect } from 'react'
import axios from 'axios'
import countryService from './services/countries'

const SearchBar = ({ keyword, handleKeywordChange }) => {
  return (
    <div>
      find countries <input value={keyword} onChange={handleKeywordChange} />
    </div>
  )
}

const Countries = ({ countries, keyword, setKeyword }) => {
  const countriesToShow = keyword === ''
    ? countries
    : countries.filter(country => country.name.common.toLowerCase().includes(keyword.toLowerCase()))
    if (countriesToShow.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }
  if (countriesToShow.length > 1) {
    return (
      <div>
        {countriesToShow.map(country =>
          <Country key={country.cca2} name={country.name.common} setKeyword={setKeyword} />
        )}
      </div>
    )
  }
  if (countriesToShow.length === 1) {
    return (
      <CountryInfo country={countriesToShow[0]} />
    )
  }
}

const Country = ({ name, setKeyword }) => {
  return (
    <div>{name}<button onClick={() => setKeyword(name)}>show</button></div>
  )
}

const CountryInfo = ({ country }) => {
  const weatherApiKey = import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${weatherApiKey}`
  const [temperature, setTemperature] = useState(0)
  const [weatherImgSrc, setWeatherImgSrc] = useState('')
  const [wind, setWind] = useState(0)

  useEffect(() => {
    axios
      .get(`${weatherApiUrl}&lat=${country.capitalInfo.latlng[0]}&lon=${country.capitalInfo.latlng[1]}&units=metric`)
      .then(response => {
        setTemperature(response.data.main.temp)
        setWeatherImgSrc(`https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`)
        setWind(response.data.wind.speed)
      })
  }, [])
  
  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital[0]}</div>
      <div>area {country.area}</div>
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map(language =>
          <li key={language}>{language}</li>
        )}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} height={120} />
      <h2>Weather in {country.capital[0]}</h2>
      <div>temperature {temperature} Celsius</div>
      <img src={weatherImgSrc} />
      <div>wind {wind} m/s</div>
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [keyword, setKeyword] = useState('')

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value)
  }

  useEffect(() => {
    countryService
      .getAll()
      .then(allCountries => {
        setCountries(allCountries)
      })
  }, [])
  return (
    <div>
      <SearchBar keyword={keyword} handleKeywordChange={handleKeywordChange} />
      <Countries countries={countries} keyword={keyword} setKeyword={setKeyword} />
    </div>
  )
}

export default App
