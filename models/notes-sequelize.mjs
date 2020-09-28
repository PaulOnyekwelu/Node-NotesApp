import {default as Sequelize} from 'sequelize';
import { v4 } from 'uuid';
import {Note, AbstractNotesStore} from './Notes.mjs';
import {connectDB as connectSequlz, close as closeSequlz} from './sequlz.mjs';

let sequelize;

export class SQNote extends Sequelize.Model{}

export async function connectDB() {
    if(sequelize) return sequelize;
    sequelize = await connectSequlz();

    SQNote.init({
        notekey: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        title: Sequelize.STRING,
        body: Sequelize.DataTypes.TEXT
    },{sequelize, modelName: 'SQNote'})
    
    await SQNote.sync();
}

export default class SequelizeNotesStore extends AbstractNotesStore {
    async close() {
        if(sequelize) closeSequlz();
        sequelize = undefined;
    }

    async update(key, title, body) {
        await connectDB();
        const note = await SQNote.findOne({where: {notekey: key}});
        if(!note) {
            throw new Error(`no note found for key: ${key}`)
        }else{
            await SQNote.update({title, body}, {where:{notekey: key}})
            return this.read(key);
        }
    }

    async create(key, title, body) {
        await connectDB();
        const sqnote = await SQNote.create({notekey:key, title, body});
        return new Note(sqnote.notekey, sqnote.title, sqnote.body);
    }

    async read(key) {
        await connectDB();
        const note = await SQNote.findOne({where: {notekey: key}});
        if(!note) throw new Error(`no note found for key: ${key}`);
        else return new Note(note.notekey, note.title, note.body);
    }

    async destroy(key) {
        await connectDB();
        const note = await SQNote.findOne({where: {notekey: key}});
        if(!note) throw new Error(`no note found for ${key}`);
        else await SQNote.destroy({where: {notekey: key}})
    }

    async keyList() {
        await connectDB();
        const notes = await SQNote.findAll({attributes: ['notekey']});
        const notekeys = notes.map(note => note.notekey);
        return notekeys;
    }

    async count() {
        await connectDB();
        return await SQNote.count();
    }
}