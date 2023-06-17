import fetchCoords from "./fetchCoords" 
import fetchDaylightData from "./fetchDaylightData"

export default async function fetchData(cityName) {
    cityName = cityName.toLowerCase().replace(/\s/g, '-')
    let cleanCityNameOutput = cityName.replace(/\-/g, ' ').split(' ').map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(' ').trim()

    const coords = await fetchCoords(cityName)
    const daylightComparisonText = await fetchDaylightData(coords, cleanCityNameOutput)
        .then(data => {
         return data
         })

    return daylightComparisonText

}