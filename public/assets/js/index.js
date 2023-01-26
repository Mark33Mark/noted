let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteMsg = document.querySelector('.note-saved');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

// get local timezone
const local_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Show an element
const show = ( elem ) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = ( elem ) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the notes in the textarea
let activeNote = {};

// --Server Requests -------------------------------------------

const getNotes = () => 
  fetch('.netlify/functions/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

const saveNote = (note) =>
    fetch('.netlify/functions/create_note', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  })
    .then((response) => response.json())
    .then((data) => saveMessage(data)
  )
    .catch((error) => {
      console.error('Error:', error);
  });

  const deleteNote = (request) => 

    fetch(`.netlify/functions/delete_note`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

// -------------------------------------------------------------

const renderActiveNote = () => {
  hide(saveNoteBtn);

  if ( activeNote.note_id ) {
    noteTitle.setAttribute( 'readonly', true );
    // noteText.setAttribute( 'readonly', false );
    noteTitle.value = activeNote.title;
    noteText.value = `${activeNote.text}\n\nsaved:  ${activeNote.date}`;
  } else {
    noteTitle.removeAttribute( 'readonly' );
    // noteText.removeAttribute( 'readonly' );
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleNoteSave = () => {
  const newNote = {
    local_timezone: local_timezone,
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote).then(() => {
    
    // getAndRenderNotes();
    renderNoteList();
    renderActiveNote();
  });
};

// Delete the clicked note
const handleNoteDelete = ( e ) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;

  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).note_id;
  const sqlId = JSON.parse(note.parentElement.getAttribute('data-note')).sql_id;

  console.log( 'the note id = ' + noteId);
  console.log( 'the sql id = ' + sqlId);

  if (activeNote.note_id === noteId && activeNote.sql_id === sqlId) {
    activeNote = {};
  }

  const mergeRequest = {
    sql_id: sqlId,
    note_id: noteId
  };

  console.log(mergeRequest);

  deleteNote(mergeRequest).then(() => {
    renderNoteList();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
const handleNoteView = ( e ) => {
  e.preventDefault();
  activeNote = JSON.parse( e.target.parentElement.getAttribute( 'data-note' ));
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

const saveMessage = message => {

  saveNoteMsg.innerText = message;
  saveNoteMsg.style.display = 'inline';
  noteText.style.height = '4rem';
  
  setTimeout( () => {
    saveNoteMsg.innerText = '';
    noteText.style.height = 'calc(100% - 63px)';
  }, 1000);
  
};

// Render list of note titles
const renderNoteList = () => {

  getNotes() 
    .then( response => response.json())
    .then( data =>  {
          prepareNoteList(data);
    });
};

// Prepare list of notes with the items from the server response
const prepareNoteList = ( data ) => {
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (data.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  data.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
}

// -------------------------------------------------------------

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

//  getAndRenderNotes();
renderNoteList();
