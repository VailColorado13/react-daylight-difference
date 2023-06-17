const options = {
    method: 'GET',
    headers: { 'x-api-key': '1yz4ajqdQkffLCi+Mc7rSw==4p8tzPBBavrNR6bD' }
} 

export default async function fetchCoords (input, setLoading) {
     const geoUrl = `https://api.api-ninjas.com/v1/geocoding?city=${input}`

     const geoResponse =  await fetch(geoUrl, options)
     const geoObject = await geoResponse.json()
     console.log(geoObject)
     if (!geoObject[0]) {
        setLoading(false)
        alert('It doesn\'t look like we have that city in our database.')  
    }
     else return geoObject


    return coords
}