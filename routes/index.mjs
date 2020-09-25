import express from 'express';
import { NotesStore as notes } from '../app.mjs';
import { default as util } from 'util';

export const router = express.Router();

/* GET home page. */
router.get('/', async(req, res, next) => {

  try {

    await notes.create('34dfe', 'this is the title', 'wow this is the body');
    await notes.create('2222', 'this is the title2', 'wow this is the body2');
    const keyList = await notes.keyList();
    const keyPromises = keyList.map(key => notes.read(key));
    const noteList = await Promise.all(keyPromises);
    res.render('index', { title: 'HomePage', noteList });

  } catch (err) {
      next(err);
  }
});

export default router;
