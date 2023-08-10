
import React, {useState, useEffect} from 'react'
import Axios from 'axios'
import Button from './components/Button'
import style from './style.css'
import { nanoid } from 'nanoid'


function App() {

  const [countries, setCountries] = useState({})
  const [inputMatches, setInputMatches] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('')
  const [weatherData, setWeatherData] = useState(false)
  const [isDay, setIsDay] = useState(true)

useEffect(() => {
  Axios.get('https://restcountries.com/v3.1/all')
  .then(response => {
    setCountries(response.data)
    console.log(response.data)
  })
  }, [])

  useEffect(() => {
    for (let i = 0; i < countries.length; i++) {
      if (countries[i].name.common === selectedCountry) {
    let lat = countries[i].latlng[0]
    let lng = countries[i].latlng[1]
    console.log(lat, lng)
    let weatherString = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`
    Axios.get(weatherString)
    .then(response => {
      setWeatherData(response.data)
    })
  }}

  }, [selectedCountry])


  function checkName(e) {
    let matchedCountries = new Set()
    for (let i = 0; i < countries.length; i++) {
      for (let j = 0; j < e.target.value.length; j++) {
        if (e.target.value[j].toLowerCase() !== countries[i].name.common[j].toLowerCase()) {
          break
        }
        if (j === e.target.value.length - 1) {
          matchedCountries.add(countries[i].name.common)
        }
      }
      
      /* if (countries[i].name.common === e.target.value) {
        matchedCountries.add(countries[i].name.common)
      } */
    }
    setInputMatches([...matchedCountries]) 
  }

  function handleClick(country) {
    setSelectedCountry(country)
  }



  const WeatherDisplayer = () => {
        return(
          <>
          <div>
            <p>Temperature: {weatherData && weatherData.current_weather.temperature}</p>
            <p>Windspeed: {weatherData && weatherData.current_weather.windspeed}</p>
          </div>
          <div>
            Time: {weatherData && weatherData.current_weather.time}
          </div>
          <h3>Forecast</h3>
          <div>
            <table>
              <thead>
                <tr>
                  <td>
                    Expected temperature:
                  </td>
                </tr>
              </thead>
              <tbody>
              <tr>
                <td>
                  Time: {weatherData && weatherData.hourly.time.map(t => <div key={nanoid()}>
                      {t}
                    </div>)}
                </td>
                <td>
                  Temperature: {weatherData && weatherData.hourly.temperature_2m.map(temp => <div key={nanoid()}>
                    {temp} C
                  </div>)}
                </td>
              </tr>
              </tbody>
            </table>
            
          </div>
          </>
        )
  }

  return (
    <div className="App-container" >
      <div className="App">
        <h1>Weather app</h1>
        <input 
        onChange={checkName}
        placeholder="Search by Country"
        />
        <p>Click below to select country</p>
        {inputMatches.map(country => <Button key={country} country={country} 
        onClick={() => handleClick(country)} className="select-country">
        {country}</Button>
        )}
        <div className="selected-country" style={{visibility: selectedCountry ? 'visible' : 'hidden' }}>
          Selected country: {selectedCountry}
        </div>
        {selectedCountry && <WeatherDisplayer />}
      </div>
    </div>
  );
}

export default App;
