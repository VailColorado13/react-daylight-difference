import React from "react";
import { countryAbbreviations } from "../javascript/countries"
import ClipLoader from "react-spinners/ClipLoader"



export default function OptionsList({arrayOfCities , sendCoordinates}) {
    const [currentlyActiveButton, setCurrentlyActiveButton] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)
    let renderButtons = true
    React.useEffect(() => {setCurrentlyActiveButton('')}, [arrayOfCities])

    //the following filters out repeated cities if they are in the same state. Don't confuse geographical state with React State. 
    const filteredArray = arrayOfCities.filter((city, index) => {
        return arrayOfCities.findIndex((c) => c.state === city.state) === index
    })
    if (filteredArray.length < 2) {renderButtons = false}

   

    React.useEffect(() => {
        if (!renderButtons) {
            const state = filteredArray[0].state === undefined ? filteredArray[0].country : filteredArray[0].state
            sendCoordinates([filteredArray[0].latitude, filteredArray[0].longitude], state)
            console.log('!renderButtons')
        }
      }, [])

    
    return (
        <div className="options-container">
          {renderButtons ? (
            <>
              <h3>{`Ok, which ${arrayOfCities[0].name} are you looking for?`}</h3>
              <div className="buttons-container">
                {filteredArray.map((city, index) => {
                  const key = index;
      
                  return (
                    <button
                      key={key}
                      className={`option-button ${currentlyActiveButton === key ? "clicked" : ""}`}
                      onClick={async () => {
                        setCurrentlyActiveButton(key)
                        setIsLoading(true)
                        try {
                          const state = city.state === undefined ? city.country : city.state;
                          await sendCoordinates([city.latitude, city.longitude], state);
                        } catch (error) {

                        }
                        setIsLoading(false);
                      }}
                    >
                       <div className="loader-button-content">
                             <span>{`${city.name}, ${city.state ? city.state : countryAbbreviations[city.country]} `}</span>
                            {   currentlyActiveButton === key &&
                                <ClipLoader color="black" loading={isLoading} size={8} />}
                         </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* Render alternative content when renderButtons is false */
            <h3>{`Ah, beautiful ${filteredArray[0].name}!`}</h3>
                 
          )}
        </div>
      )
}