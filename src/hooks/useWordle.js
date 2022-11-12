import { useState } from 'react'

const useWordle = (solution) => {
  const [turn, setTurn] = useState(0)
  const [currentGuess, setCurrentGuess] = useState('')
  const [guesses, setGuesses] = useState([...Array(6)]) // each guess is an array
  const [history, setHistory] = useState([]) // each guess is a string
  const [isCorrect, setIsCorrect] = useState(false)
  const [usedKeys, setUsedKeys] = useState({})
  // format a guess into an array of letter objects 
  // e.g. [{key: 'a', color: 'yellow'}]
  const formatGuess = () => {
    let solutionArray = [...solution]
    let formatedGuess = [...currentGuess].map(letter => {
      return {
        key: letter,
        color: 'grey'
      }
    })
    //find any green letters in the solution
    formatedGuess.forEach((letter, index) => {
      if (solutionArray[index] === letter.key) {
        formatedGuess[index].color = 'green'
        solutionArray[index] = null
      }
    })
    //find any yellow letters in the solution
    formatedGuess.forEach((letter, index) => {
      if (solutionArray.includes(letter.key) && letter.color !== 'green') {
        formatedGuess[index].color = 'yellow'
        solutionArray[solutionArray.indexOf(letter.key)] = null
      }
    })
    return formatedGuess
  }

  // add a new guess to the guesses state
  // update the isCorrect state if the guess is correct
  // add one to the turn state
  const addNewGuess = (formatedGuess) => {
    if (currentGuess === solution) {
      setIsCorrect(true)
    }
    setGuesses((prevGuesses) => {
      let newGuesses = [...prevGuesses]
      newGuesses[turn] = formatedGuess
      return newGuesses
    })
    setHistory((prevHistory) => {
      return [...prevHistory, currentGuess]
    })
    setTurn((prevTurn) => {
      return prevTurn + 1
    }
    )
    setUsedKeys((prevUsedKeys) => {
      let newKeys = {...prevUsedKeys}
      formatedGuess.forEach(letter => {
        const currentColor= newKeys[letter.key]
        if(letter.color==='green'){
          newKeys[letter.key] = 'green'
          return
        }
        if (letter.color === 'yellow' && currentColor !== 'green') {
          newKeys[letter.key] = 'yellow'
          return
        }
        if (letter.color === 'grey' && currentColor !== 'green' && currentColor !== 'yellow') {
          newKeys[letter.key] = 'grey'
          return
        }
      })
      return newKeys;
    })
    setCurrentGuess('')
  }

  // handle keyup event & track current guess
  // if user presses enter, add the new guess
  const handleKeyup = ({ key }) => {
    if (key === 'Enter') {
      if (turn > 5) {
        console.log('game over')
        return
      }
      if (history.includes(currentGuess)) {
        console.log('You already guessed that!')
        return
      }
      if (currentGuess.length !== 5) {
        console.log('Guess must be 5 letters long')
        return
      }
      const formatted = formatGuess()
      addNewGuess(formatted)
    }
    if (key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1))
      return
    }
    if (/^[A-Za-z]$/.test(key)) {
      if (currentGuess.length < 5) {
        setCurrentGuess(prev => prev + key)
      }
    }
  }

  return { turn, currentGuess, guesses, isCorrect,usedKeys, handleKeyup }
}

export default useWordle