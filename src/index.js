import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import session from 'express-session';
import db from './models';
import middleware from './middleware';
import api from './api';
import config from './config/config.json';
import path from 'path';

let app = express();
const env = process.env.NODE_ENV || 'development';
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
if (env === 'development') {
    app.use(cors({
        origin: config.corsOrigin,
        exposedHeaders: config.corsHeaders,
        credentials: config.corsCredential
    }));
}

// Pure JSON
app.use(bodyParser.json({
	limit : config.bodyLimit
}));

// x-www-urlencoded format
app.use(bodyParser.urlencoded({
    limit: config.bodyLimit
}));

app.use(session({
    secret: 'test secret for hackathon'
}));

// internal middleware
app.use(middleware({ config, db }));

app.use('/', express.static(path.join(__dirname, 'public')));

// api router
app.use('/api', api({ config, db }));

app.server.listen(process.env.PORT || config.port, () => {
	console.log(`Started on port ${app.server.address().port}`);
});