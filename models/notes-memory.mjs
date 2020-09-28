import { Note, AbstractNotesStore } from './Notes.mjs';

const notes = [];

export default class InMemoryNotesStore extends AbstractNotesStore {
    close () {};

    update (key, title, body) {
        notes[key] = new Note(key, title, body);
        return notes[key];
    } 

    create(key, title, body) {
        notes[key] = new Note(key, title, body);
        return notes[key];
    }

    read (key) {
        if(notes[key]) return notes[key];
        else throw Error(`note ${key} does not exist`);
    }

    destroy (key) {
        if(notes[key]) delete notes[key];
        else throw Error(`note ${key} does not exist`);
    }

    keyList () {
        return Object.keys(notes);
    }
    
    count () {
        return notes.length;
    }
}
