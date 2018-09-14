import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import session from './session-check';
import UserModel from '../models/user';
import https from 'https';
import qs from 'querystring';

export default ({ config, db }) => {
    let api = Router();
    const env = process.env.NODE_ENV || 'development';

    // mount the facets resource
    api.use('/facets', facets({ config, db }));

    // perhaps expose some API metadata at the root
    api.get('/', (req, res) => {
        if (session(req, res)) {
            res.sendStatus(200);
        }
    });

    api.post('/login', ({body, session}, res) => {
        const model = UserModel(db.sequelize, db.Sequelize);
        model.findOne({
            where: {
                ID: body.userid,
                PW: body.access_code
            }
        }).then(user => {
            if (user !== null) {
                session.userIndex = user.Index;
                session.userid = user.ID;
                session.role = user.Role;
                session.name = user.Name;

                const redirect = `https://api.sandbox.thingplus.net/v2/oauth2/authorize?response_type=code&client_id=${ session.userid }&redirect_uri=http://13.125.247.123:8080/api/login/proc`;

                console.log(redirect);
                res.status(200).send({
                    'redirect_uri': redirect
                });
            } else {
                res.sendStatus(401);
            }
        });
    });

    api.get('/login/proc', ({query, session, hostname, originalUrl}, res) => {
        const data = {
            code: query.code,
            client_id: session.userid,
            client_secret: 'belt12!@',
            redirect_uri: 'http://13.125.247.123:8080/api/login/proc',
            grant_type: 'authorization_code'
        };

        const options = {
            hostname: "api.sandbox.thingplus.net",
            path: '/v2/oauth2/token',
            method: "POST",
            headers: {
                "content-type": "application/json",
                // "authorization": "Bearer " + session.code
            }
        };

        const requestAuthCode = https.request(options, (authRes) => {
            let chunks = [];

            authRes.on('data', (chunk) => {
                chunks.push(chunk);
            });

            authRes.on('end', () => {
                let body = Buffer.concat(chunks);
                let response = JSON.parse(body.toString());
                console.log(response);
                session.code = response.access_token;
                res.redirect("http://13.125.247.123:8080");
            });
        });

        console.log(qs.stringify(data));
        requestAuthCode.write(JSON.stringify(data));
        requestAuthCode.end();
    });

    return api;
}
