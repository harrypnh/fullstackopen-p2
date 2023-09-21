import { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({ message }) => {
  if (message.content === null) {
    return null
  }
  else if (message.error) {
    return (
      <div className='error'>
        {message.content}
      </div>
    )
  }
  else {
    
    return (
      <div className='success'>
        {message.content}
      </div>
    )
  }
}

const Filter = ({keyword, handleKeywordChange}) => {
  return (
    <form>
      <div>
        filter shown with <input value={keyword} onChange={handleKeywordChange} />
      </div>
    </form>
  )
}

const PersonForm = ({newName, newNumber, handleNameChange, handleNumberChange, addPerson}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

const Persons = ({persons, keyword, handleDeletion}) => {
  const personsToShow = keyword === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(keyword.toLowerCase()))
  return (
    <div>
      {personsToShow.map(person =>
        <Person key={person.id} person={person} handleDeletion={handleDeletion}/>
      )}
    </div>
  )
}

const Person = ({person, handleDeletion}) => {
  
  return (
    <div>
      {person.name} {person.number} <button onClick={() => handleDeletion(person.id, person.name)}>delete</button>
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [keyword, setKeyword] = useState('')
  const [message, setMessage] = useState({
    content: null,
    error: false
  })

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (persons.map(person => person.name).includes(newName)) {
      const confirmation = window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)
      if (confirmation) {
        const id = persons[persons.map(person => person.name).indexOf(newName)].id
        personService
          .update(id, personObject)
          .then(updatedPerson => {
            setPersons(persons.map(person => person.id !== id ? person : updatedPerson))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setPersons(persons.filter(person => person.id !== id))
            setNewName('')
            setNewNumber('')
            setMessage({
              content: `Information of ${personObject.name} has been already removed from server`,
              error: true
            })
            setTimeout(() => {
              setMessage({
                content: null,
                error: false
              })
            }, 5000)
          })
      }
    }
    else {
      personService
        .create(personObject)
        .then(returnedPersons => {
          setPersons(persons.concat(returnedPersons))
          setNewName('')
          setNewNumber('')
          setMessage({
            content: `Added ${returnedPersons.name}`,
            error: false
          })
          setTimeout(() => {
            setMessage({
              content: null,
              error: false
            })
          }, 5000)
        })
    }
  }

  const handleDeletion = (id, name) => {
    const confirmation = window.confirm(`Delete ${name} ?`)
    if (confirmation) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter keyword={keyword} handleKeywordChange={handleKeywordChange} />
      <h2>add a new</h2>
      <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addPerson={addPerson} />
      <h2>Numbers</h2>
      <Persons persons={persons} keyword={keyword} handleDeletion={handleDeletion} />
    </div>
  )
}

export default App