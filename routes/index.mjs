import express from 'express';
import { NotesStore as notes } from '../app.mjs';

export const router = express.Router();

/* GET home page. */
router.get('/', async(req, res, next) => {
  try {
    // await notes.create('fsdif334', 'first post', 'this is nubmer 1');
    // await notes.create('secs367', 'second post', 'this is nubmer 2');
    const keyList = await notes.keyList();
    const keyPromises = keyList.map(async key => await notes.read(key));
    const noteList = await Promise.all(keyPromises);
    res.render('index', { title: 'HomePage', noteList });
    
  } catch (err) {
      next(err);
  }
});
