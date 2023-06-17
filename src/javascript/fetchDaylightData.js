import getTomorrowsDate from "./getTomorrowsDate"
import getYesterdaysDate from "./getYesterdaysDate"
import getTodaysDate from "./getTodaysDate"
import { countryAbbreviations } from "./countries"


export default async function fetchDaylightData(coords, city, state) {

  if (coords === null) return ["" , ""]
  console.log('logging' , state)

  const daylightUrlToday = [`https://api.sunrise-sunset.org/json?lat=${coords[0]}&lng=${coords[1]}&date=today`, `https://api.sunrisesunset.io/json?lat=${coords[0]}&lng=${coords[1]}&date=${getTodaysDate()}` ]
 
  const daylightUrlTomorrow = [`https://api.sunrise-sunset.org/json?lat=${coords[0]}&lng=${coords[1]}&date=tomorrow`,`https://api.sunrisesunset.io/json?lat=${coords[0]}&lng=${coords[1]}&date=${getTomorrowsDate()}` ]

  const daylightUrlYesterday = [`https://api.sunrise-sunset.org/json?lat=${coords[0]}&lng=${coords[1]}&date=yesterday`, `https://api.sunrisesunset.io/json?lat=${coords[0]}&lng=${coords[1]}&date=${getYesterdaysDate()}`]

  async function fetchDaylightData(urls) {
    try {
      const response = await fetch(urls[0]);
      const data = await response.json();
      return data.results.day_length.split(':');
    } catch (error) {
      // Handle the error
      console.error('An error occurred on the first fetch operation:', 'system will try a backup API');
      
      // Try a different URL
      
      try {
        const fallbackResponse = await fetch(urls[1]);
        const fallbackData = await fallbackResponse.json();
        return fallbackData.results.day_length.split(':');
      } catch (fallbackError) {
        console.error('An error occurred during the fallback fetch operation:', fallbackError);
        // You can choose to return a default value or throw a custom error here
        throw fallbackError;
      }
    }
  }
  
  const calculateSecondsOfDaylight = async (daylightUrl) => {
    const data = await fetchDaylightData(daylightUrl)
    const [hours, minutes, seconds] = data
    return Number(hours * 60 * 60) + Number(minutes * 60) + Number(seconds)
  }
  
  const secondsOfDaylightToday = await calculateSecondsOfDaylight(daylightUrlToday)
  const secondsOfDaylightTomorrow = await calculateSecondsOfDaylight(daylightUrlTomorrow)
  const secondsOfDaylightYesterday = await calculateSecondsOfDaylight(daylightUrlYesterday)
 
  console.log(secondsOfDaylightToday , secondsOfDaylightTomorrow ,secondsOfDaylightYesterday )

  function TimeDifference(today, testDay) {
    this.todayLonger = today > testDay 
    this.minutesDiff = this.todayLonger === false ?  Math.abs(Math.floor((testDay - today) / 60)) : Math.abs(Math.floor((today - testDay) / 60))
    this.secondsDiff = Math.abs((today - testDay) % 60)
  }

 
    let todayVSyesterday = new TimeDifference(secondsOfDaylightToday,secondsOfDaylightYesterday)
    let todayVStomorrow = new TimeDifference(secondsOfDaylightToday,secondsOfDaylightTomorrow)

    let responseFieldYesterdayComparison = ''
    let responseFieldTomorrowComparison = ''

//This section handles the daylight difference between today and yesterday
if (state.length === 2 && countryAbbreviations[state]) {state = countryAbbreviations[state]}
 
if (!todayVSyesterday.todayLonger) {
  if (todayVSyesterday.minutesDiff === 0) {
    responseFieldYesterdayComparison = `In  ${city}, ${state}, today is ${todayVSyesterday.secondsDiff} seconds shorter than yesterday.`
  }

  else{
  responseFieldYesterdayComparison = ` In  ${city}, ${state}, today is ${todayVSyesterday.minutesDiff} ${todayVSyesterday.minutesDiff > 1 ? 'minutes' : 'minute'} and ${todayVSyesterday.secondsDiff} seconds shorter than yesterday.`
   }
  
  }
else {
  if (todayVSyesterday.minutesDiff === 0) {
    responseFieldYesterdayComparison = `In  ${city}, ${state}, today is ${todayVSyesterday.secondsDiff} seconds longer than yesterday.`
  }
  else {
    responseFieldYesterdayComparison = `In  ${city}, ${state}, today is ${todayVSyesterday.minutesDiff} ${todayVSyesterday.minutesDiff > 1 ? 'minutes' : 'minute'} and ${todayVSyesterday.secondsDiff} seconds longer than yesterday.`
  }
}

//This section handles the daylight difference between today and tomorrow
if (todayVStomorrow.todayLonger) {
  if (todayVStomorrow.minutesDiff === 0) {
    responseFieldTomorrowComparison = `Tomorrow will be ${todayVStomorrow.secondsDiff} seconds shorter than today.`


  } else {
    responseFieldTomorrowComparison =`Tomorrow will be ${todayVStomorrow.minutesDiff} ${todayVStomorrow.minutesDiff > 1 ? 'minutes' : 'minute'} and ${todayVStomorrow.secondsDiff} seconds shorter than today.`
  }

  } else {  
   if (todayVSyesterday.minutesDiff === 0) {
    responseFieldTomorrowComparison = `Tomorrow will be ${todayVStomorrow.secondsDiff} seconds longer than today.`
  }
  else {
    responseFieldTomorrowComparison =  `Tomorrow will be  ${todayVStomorrow.minutesDiff}  ${todayVStomorrow.minutesDiff >  1 ? 'minutes' : 'minute'} and ${todayVStomorrow.secondsDiff} seconds longer than yesterday.`
  }
}

return [responseFieldYesterdayComparison, responseFieldTomorrowComparison]

}




