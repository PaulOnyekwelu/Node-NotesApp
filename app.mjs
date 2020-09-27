import http from 'http';
import fs from 'fs';
import { default as express } from 'express';
import { default as path } from 'path';
import hbs from 'hbs';
import cookieParser from 'cookie-parser';
import { default as logger} from 'morgan';
import rfs from 'rotating-file-stream';

import { __dirname } from "./approotdir.mjs";
import { normalizePort, onError, onListening, handle404, basicErrorHandler } from "./appsupport.mjs";
import { InMemoryNotesStore } from "./models/notes-memory.mjs";
import { FsNotesStore } from "./models/notes-fm.mjs";
import { router as indexRouter } from "./routes/index.mjs";
import { router as notesRouter } from './routes/notes.mjs';

const app = express();
// export const NotesStore = new InMemoryNotesStore();
export const NotesStore = new FsNotesStore();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'partials'));


// creating a write stream
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flag: 'a'})
app.use(logger(process.env.REQUEST_LOG_FORMAT || 'dev', {
    stream: process.env.REQUEST_LOG_FILE ? 
        rfs.createStream(process.env.REQUEST_LOG_FILE, {
            size: '10M', interval: '1d', compress: 'gzip'
        })
        : process.stdout
} ))

if(process.env.REQUEST_LOG_FILE){
    app.use(logger(process.env.REQUEST_LOG_FORMAT || 'dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/assets', express.static(path.join(__dirname, 'public')));
app.use('/assets/vendor/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/assets/vendor/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/assets/vendor/popper.js', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd')));
app.use('/assets/vendor/feather-icons', express.static(path.join(__dirname, 'node_modules/feather-icons/dist')))



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
