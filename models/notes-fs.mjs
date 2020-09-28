import { Note, AbstractNotesStore } from "./Notes.mjs";
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { __dirname } from "../approotdir.mjs";


export default class FsNotesStore extends AbstractNotesStore {
    async close () {};

    async update (key, title, body) {
        return crupdate(key, title, body);
    }

    async  create (key, title, body) {
        return crupdate(key, title, body);
    }

    async read (key) {
        const notesdir = await notesDir();
        const theNote = await readJSON(notesdir, key);
        return theNote;
    }

    async destroy (key) {
        try {
            const notesdir = await notesDir();
            await fs.unlink(path.join(notesdir, `${key}.json`));
        } catch (err) {
            console.log(err)
        }
    }

    async keyList () {
        const notesdir = await notesDir();
        let filez = await fs.readdir(notesdir);
        if(!filez || typeof filez === 'undefined') filez = [];
        const theNotes = filez.map(async file => {
            const key = path.basename(file, '.json');
            const theNote = await readJSON(notesdir, key);
            return theNote.key;
        })
        return Promise.all(theNotes);
    }

    async count () {
        const notesdir = await notesDir();
        const filez = await fs.readdir(notesdir);
        return filez.length;
    }
}

//helper functions 
async function notesDir() {
    const dir = process.env.NOTE_FS_DIR || path.join(__dirname, 'note_fs_dir');
    const check = existsSync(dir);
    if(!check){
        await fs.mkdir(dir);  
    }
    // await fs.ensureDir(dir);
    return dir;
}

async function readJSON (notesdir, key) {
    const filePath = path.join(notesdir, `${key}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return Note.fromJSON(data);
}

async function crupdate(key, title, body) {
    const notesdir = await notesDir();
    if(key.indexOf('/') >= 0) throw new Error('key should not contain /');
    const note = new Note(key, title, body);
    const writeTo = path.join(notesdir, `${note.key}.json`);
    await fs.writeFile(writeTo, note.JSON, 'utf-8');
    return note;
}
