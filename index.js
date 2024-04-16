const express = require('express')
const app = express()
const morgan = require('morgan') // morgan muuttuja käyttöön
app.use(express.json())

const cors = require('cors')
app.use(cors())

// käytetään morgan middlewarea tiny-konfiguraatiolla (logaa konsoliin tiedon pyynnöstä, sen onnistumisesta ja vasteajasta)
app.use(morgan('tiny'));

let persons = [
    {
    name: "Arto Hellas", 
    number: "040-123456",
    id: 1
    },
    {
    name: "Ada Lovelace", 
    number: "39-44-5323523",
    id: 2
    },
    {
    name: "Dan Abramov", 
    number: "12-43-234345",
    id: 3
    },
    {
    name: "Mary Poppendieck", 
    number: "39-23-6423122",
    id: 4
    }
    ,
    {
    name: "Turo Tailor", 
    number: "040-123456",
    id: 5
    },
    {
    name: "Mauri Äkäslompolo", 
    number: "050-654321",
    id: 6
    }
  ]


  // info-sivu, johon luettelon hlöiden lukumäärä ja pyynnön ajanhetki
  const lkm = persons.length;

  app.get('/info', (request, response) => {
    const aika = new Date();
    response.send('<p1>Puhelinluettelossa on ' + lkm + ' henkilön tiedot.</p1><br><p2>Ajanhetki: ' + aika + '</p2>');
  });
  
  // kaikkien luettelon hlöiden tiedot
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  // yksittäisen hlön tiedot
  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    // mikäli id:llä löytyy hlö niin tulostetaan tiedot, ellei, niin 404 virheilmoitus.
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

  // id:tä vastaavan henkilötiedon deletointi
  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

 // uuden hlön lisäys: generoidaan ensin random-funktiolla uusi id

 const generateId = () => {
    const newId = Math.floor(Math.random() * 100)
    return newId
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body

// jos nimi puuttuu -> virheilmoitus
    if (!body.name) {
      return response.status(400).json({ 
        error: 'nimi puuttuu' 
      })
    }

    // jos numero puuttuu -> virheilmoitus
    if (!body.number) {
        return response.status(400).json({ 
          error: 'numero puuttuu' 
        })
      }

   // jos nimi on jo olemassa  -> virheilmoitus
      if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({ error: 'Nimi on jo luettelossa' });
      }
    // jos numero on jo olemassa  -> virheilmoitus
      if (persons.find(person => person.number === body.number)) {
        return response.status(400).json({ error: 'Numero on jo luettelossa' });
      }


      // jos ok, lisätään luetteloon
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
      }
  
    persons = persons.concat(person)
  
    response.json(person)
  })


  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })