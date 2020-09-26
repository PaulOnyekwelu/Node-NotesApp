import http from 'http';
import { default as express } from 'express';
import { default as path } from 'path';
import hbs from 'hbs';
import cookieParser from 'cookie-parser';
import { default as logger} from 'morgan';

import { __dirname } from "./approotdir.mjs";
import { normalizePort, onError, onListening, handle404, basicErrorHandler } from "./appsupport.mjs";
import { InMemoryNotesStore } from "./models/notes-memory.mjs";
import { router as indexRouter } from "./routes/index.mjs";
import { router as notesRouter } from './routes/notes.mjs';

const app = express();
export const NotesStore = new InMemoryNotesStore();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'partials'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/notes', notesRouter);

// catch 404 and forward to error handler
app.use(handle404);

// error handler
app.use(basicErrorHandler);

export const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

export const server = http.createServer(app);
server.listen(port);
server.on('listening', onListening);
server.on('error', onError);
