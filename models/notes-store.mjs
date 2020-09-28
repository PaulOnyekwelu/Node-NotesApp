import { default as DBG } from "debug";

const debug = DBG("noteApp:store");
const debugError = DBG("noteApp:store-error");

var _NotesStore;
export async function storeModel(model) {
	try {
		const notesStoreModule = await import(`./notes-${model}.mjs`);
		const notesStoreClass = notesStoreModule.default;
        _NotesStore = new notesStoreClass();
        return _NotesStore;
	} catch (err) {
		debug(err);
		throw new Error(`no recognised notestore in ${model} because ${err}`)
	}
}

export {_NotesStore as NotesStore};
