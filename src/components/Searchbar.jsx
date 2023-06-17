import React from "react";
import handleClick from '../javascript/fetchData'


export default function Searchbar({handleUserInput}) {

    const [inputValue, setInputValue] =  React.useState('')
    const handleChange = event => {
        setInputValue(event.target.value)
    }


    return (
        <div className = 'search-container'>
            <div className = 'search-bar'>
             <input className = 'search-input' onChange={handleChange} type="text" placeholder='Enter the name of a city' />
             <button className = 'search-button' onClick={() => handleUserInput(inputValue)} type="submit">Search</button>
            </div>
        </div>   
    )
}