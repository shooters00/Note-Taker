const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');

// GET Route for retrieving all the tips
notes.get('/', (req, res) => {
  readFromFile('./db/db.json')
    .then((data) => res.json(JSON.parse(data)));
});

// DELETE Route for a specific tip
notes.delete('/:id', (req, res) => {
  const id = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all tips except the one with the ID provided in the URL
      const result = json.filter((db) => db.id !== id);

      // Save that array to the filesystem
      writeToFile('./db/db.json', result);

      // Respond to the DELETE request
      res.json(`Item ${id} has been deleted 🗑️`);
    });
});

// POST Route for a new UX/UI tip
notes.post('/', (req, res) => {
  console.log(req.body);

  const { title, text} = req.body;

  if (req.body) {
    const newId = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newId, './db/db.json');
    res.json(newId);
  } else {
    res.error('Error in adding note');
  }
});

module.exports = notes;
