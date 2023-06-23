import { useState, useEffect } from "react";
import noteService from "./services/note";

import Note from "./components/Note";
import Notification from "./components/Notification";
import Footer from "./components/Footer";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("a new note...");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    noteService.getAll().then(notesData => setNotes(notesData));
  }, []);

  const addNote = event => {
    event.preventDefault();

    const nextNote = {
      content: newNote,
      important: Math.random() < 0.5,
    };

    noteService.create(nextNote).then(returnedNote => {
      setNotes([...notes, returnedNote]);
      setNewNote("");
    });

    setNewNote("");
  };

  const toggleImportance = id => {
    const note = notes.find(note => note.id === id);
    const updatedNote = { ...note, important: !note.important };

    noteService
      .update(id, updatedNote)
      .then(returnedNote =>
        setNotes(notes.map(note => (note.id !== id ? note : returnedNote)))
      )
      // Display error message for 5 seconds
      .catch(_ => {
        setErrorMessage(
          `Note '${note.content}' was already removed from the server`
        );

        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);

        setNotes(notes.filter(note => note.id !== id));
      });
  };

  const notesToShow = showAll ? notes : notes.filter(note => note.important);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          Show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        <ul>
          {notesToShow.map(note => (
            <Note
              key={note.id}
              note={note}
              toggleImportance={() => toggleImportance(note.id)}
            />
          ))}
        </ul>
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={event => setNewNote(event.target.value)}
        />
        <button type="submit">Save</button>
      </form>
      <Footer />
    </div>
  );
};

export default App;
