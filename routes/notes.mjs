import express from "express";
import { NotesStore as notes } from "../app.mjs";



export const router = express.Router();

router.get("/add", async (req, res, next) => {
	res.render("noteEdit", {
		title: "Add a Note",
		docreate: true,
		notekey: "",
		note: undefined,
	});
});

router.get("/edit", async (req, res, next) => {
    const { key } = req.query;
	try {
		const note = await notes.read(key);
		res.render("noteEdit", {
			title: "Edit Note",
			docreate: false,
			notekey: key,
			note,
		});
	} catch (err) {
		next(err);
	}
});

router.get("/view", async (req, res, next) => {
	const { key } = req.query;
	try {
		if (key) {
			const note = await notes.read(key);
			console.log("json formatted: ", note.JSON)
			res.render("noteView", {
				title: note ? note.title : "",
				notekey: key,
				note,
			});
		}
	} catch (err) {
		next(err);
	}
});

router.get('/destroy', async(req, res, next) => {
	const {key} = req.query;
	try {
		const note = await notes.read(key);
		res.render('noteDelete', {title: `Delete ${note.title}`, note, notekey: key})
	} catch (err) {
		next(err)
	}
})


router.post("/save", async (req, res, next) => {
	const { docreate, notekey, title, body } = req.body;
	try {
		let note;
		if(!notekey) throw Error('all fields are required');
		if (docreate === "create") {
			note = await notes.create(notekey, title, body);
		} else if (docreate === "update") {
			note = await notes.update(notekey, title, body);
		}
		res.redirect(`/notes/view?key=${notekey}`);
	} catch (err) {
		next(err);
	}
});


router.post('/destroy/confirm', async(req, res, next) => {
	const {notekey} = req.body;
	try {
		await notes.destroy(notekey);
		res.redirect('/');
	} catch (err) {
		next(err)
	}
})
