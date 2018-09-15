import { version } from '../../package.json';
import { Router } from 'express';
import sessionCheck from './session-check';
import UserModel from '../models/user';
import deploy from '../config/deploy';
import user from './user';
import bus from './bus';
import https from 'https';
import qs from 'querystring';

export default ({ config, db }) => {
    let api = Router();

    // mount the facets resource
    api.use('/user', user({ config, db }));
    api.use('/bus', bus({config, db}));

    // perhaps expose some API metadata at the root
    api.get('/', ({session}, res) => {
        // if (sessionCheck(session, res)) {
            res.sendStatus(200);
        // }
    });

    api.post('/login', ({body, session}, res) => {
        const model = UserModel(db.sequelize, db.Sequelize);
        model.findOne({
            where: {
                userid: body.userid,
                password: body.access_code
            }
        }).then(user => {
            if (user !== null) {
                session.userIndex = user.index;
                session.userid = user.userid;
                session.role = user.role;
                session.name = user.name;
                session.authorized = false;

                console.log(session);

                const redirect = `https://api.sandbox.thingplus.net/v2/oauth2/authorize?response_type=code&client_id=${ session.userid }&redirect_uri=${ deploy.api }/api/login/proc`;

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
            redirect_uri: `${deploy.api}/api/login/proc`,
            grant_type: 'authorization_code'
        };

        const options = {
            hostname: "api.sandbox.thingplus.net",
            path: '/v2/oauth2/token',
            method: "POST",
            headers: {
                "content-type": "application/json",
                // "authorization": "Bearer " + sessionCheck.code
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
                session.authorized = true;
                res.redirect(deploy.front);
            });
        });

        console.log(qs.stringify(data));
        requestAuthCode.write(JSON.stringify(data));
        requestAuthCode.end();
    });

    return api;
}
