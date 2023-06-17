import { useState, useEffect } from 'react'
import './App.css'
import Searchbar from './components/Searchbar'
import fetchCoords from './javascript/fetchCoords'
import fetchDaylightData from './javascript/fetchDaylightData'
import ResponseSection from './components/ResponseSection.jsx'
import BeatLoader from "react-spinners/BeatLoader";
import OptionsList from './components/OptionsList'


function App() {
  const [city, setCity] = useState('')
  const [displayText, setDisplayText] = useState('')
  const [arrayOfCities, setArrayOfCities] = useState([])

  const [loading, setLoading] = useState(false)

  const handleUserInput = (userInput) => {
    setCity(userInput)
  }



const sendCoordinates = async (coordinates, state) => {
    let cleanCityNameOutput = city.toLowerCase().replace(/\-/g, ' ').split(' ').map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(' ').trim()
    const daylightInfo = await fetchDaylightData(coordinates, cleanCityNameOutput, state)
    setDisplayText(daylightInfo)
 } 

  useEffect(() => {
    const fetchDataAndUpdateDisplayText = async () => {
      if (city.length > 0) {
        setLoading(true)
        const data = await fetchCoords(city, setLoading)
        setArrayOfCities(data)
        setLoading(false)
      }
    }
    sendCoordinates(null, null)
    fetchDataAndUpdateDisplayText()
  }, [city])


  return (
    <>
      <div className='stableUI'>
        <h1>Daylight Difference</h1>
        <Searchbar handleUserInput={handleUserInput}/>
        <BeatLoader loading={loading}/>
        {arrayOfCities.length > 0 && <OptionsList
          arrayOfCities = {arrayOfCities} 
          sendCoordinates = {sendCoordinates}
          initialState = {undefined} 
        />}
        <div className = 'responseSection'>
            {displayText.length > 0 && !loading && <ResponseSection text={displayText}/>}
        </div>
      </div>
      <div className = 'attributions'> 
      <h5>Powered By:</h5>
      <div className = 'attributionsContainer'>
        <span>sunrise-sunset.org</span> 
        <span>api-ninjas.com</span> 
        <span>sunrisesunset.io/</span> 
      </div>
      </div>
      
      
    </>
  )
}

export default App
