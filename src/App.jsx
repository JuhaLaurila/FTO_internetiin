
import { useState, useEffect} from 'react'  // importoitu myös Effect hook...
import Note from './components/Note'
import noteService from './services/notes'

const App = () => { // poistettu propsit, ei enää tarvetta
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')// lisätään tila newNote lomakkeen syötettä varten...
  const [showAll, setShowAll] = useState(true) // tieto siitä, näytetäänkö muistiinpanoista kaikki vai ainoastaan tärkeät.

  useEffect(() => {
    noteService
      .getAll()
      .then(response => {
        setNotes(response.data)
      })
  }, [])

  console.log('render', notes.length, 'notes')

  // 1. Ensin suoritetaan komponentin määrittelevän funktion runko ja 
  // renderöidään komponentti ensimmäistä kertaa -> konsoliin "render 0 notes"
  // 2. efekti n suoritus alkaa -> konsoliin "effect" ja axios.get aloittaa datan hakemisen palvelimelta
  // ja rekisteröi operaatiolle tapahtumankäsittelijäksi funktion
  // 3. JavaScript Runtime kutsuu rekisteröityä tapahtumankäsittelijäfunktiota, joka tulostaa konsoliin "promise fulfilled"
  // 4. ja tallettaa tilaan palvelimen palauttamat muistiinpanot funktiolla setNotes(response.data).
  // 5. tilan päivittävän funktion kutsu aiheuttaa komponentin uudelleen renderöitymisen.
  // -> konsoliin tulostuu render 3 notes ja palvelimelta haetut muistiinpanot renderöityvät ruudulle.

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id) // metodilla find etsitään muutettava muistiinpano ja talletetaan muuttujaan note viite siihen.
    const changedNote = { ...note, important: !note.important } // luodaan uusi olio, jonka sisältö on sama kuin vanhan olion sisältö pois lukien kenttä important jonka arvo vaihtuu päinvastaiseksi.
 
  noteService
  .update(id, changedNote)
  .then(response => {
    setNotes(notes.map(note => note.id !== id ? note : response.data))
     })
  }

// Lisätään tapahtumankäsittelijä "addNote", reagoi napin painallukseen:
  const addNote = (event) => { //Parametrin "event" arvona on metodin kutsun aiheuttama tapahtuma
    event.preventDefault() // estetään lomakkeen lähetyksen oletusarvoinen toiminta
    const noteObject = { // luodaan uutta muistiinpanoa vastaava olio noteObject 
      content: newNote, // sisältökentän arvo tilasta "newNote"
      important: Math.random() > 0.5
    }

    noteService
      .create(noteObject)
      .then(response => {
        setNotes(notes.concat(response.data))
        setNewNote('')
      })
  }
  
  const handleNoteChange = (event) => {
    console.log(event.target.value) // event.target.value viittaa inputin syötekentän arvoon.
    setNewNote(event.target.value) // event.target.value viittaa inputin syötekentän arvoon.
  }
 
  // Tallennetaan muuttujaan notesToShow näytettävien muistiinpanojen lista riippuen siitä, tuleeko näyttää kaikki vai vain tärkeät:
  const notesToShow = showAll  // ehdollinen operaattori
  ? notes
  : notes.filter(note => note.important === true)

  return (
    <div>
      <h1>Notes</h1>
      <div>

        {/*Lisätään sitten toiminnallisuus, joka mahdollistaa showAll:in tilan muuttamisen sovelluksesta:*/}
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }  {/*Napin teksti riippuu tilan showAll arvosta.*/}
        </button>
      </div>    
      <ul>
        {notesToShow.map(note => 
           <Note key={note.id} note={note}
           toggleImportance={() => toggleImportanceOf(note.id)}/>
       )}
      </ul>


      <form onSubmit={addNote}>
        {/*Lisätään lomake uuden muistiinpanon lähettämistä varten*/}

      <input 
      value={newNote}  
      onChange={handleNoteChange}/> 
        {/*... ja määritellään "newNote" syöte/input-komponentin attribuutin value arvoksi,*/}
        {/* rekisteröidään tapahtumankäsittelijä tilanteeseen onChange.*/}

      <button type="submit">save</button>
        {/*lisätään lähetysnappi*/}

      </form> 
    </div>
  )
}

export default App