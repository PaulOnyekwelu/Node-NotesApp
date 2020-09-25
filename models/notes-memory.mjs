import { Note, AbstractNotesStore } from './Notes.mjs';

const notes = [];

export class InMemoryNotesStore extends AbstractNotesStore {
    async close () {};

    async update (key, title, body) {
        notes[key] = new Note(key, title, body);
        return notes[key];
    } 

    async create(key, title, body) {
        notes[key] = new Note(key, title, body);
        return notes[key];
    }

    async read (key) {
        if(notes[key]) return notes[key];
        else throw Error(`note ${key} does not exist`);
    }

    async destroy (key) {
        if(notes[key]) delete notes[key];
        else throw Error(`note ${key} does not exist`);
    }

    async keyList () {
        return Object.keys(notes);
    }
    
    async count () {
        return notes.length;
    }
}


// const note = new InMemoryNotesStore();
// (async() => {
//     const note1 = await note.create('34dfe', 'this is the title', 'wow this is the body');
//     const note2 = await note.create('2222', 'this is the title2', 'wow this is the body2');
//     const noteList = [note1, note2];
//     for(let note of noteList){
//         console.log(typeof note);
//         console.log(note);
//     }
// })()

