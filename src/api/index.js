import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import session from './session-check';
import UserModel from '../models/user';

export default ({ config, db }) => {
    let api = Router();
    const env = process.env.NODE_ENV || 'development';

    // mount the facets resource
    api.use('/facets', facets({ config, db }));

    // perhaps expose some API metadata at the root
    api.get('/', (req, res) => {
        if (session(req, res)) {
            res.json({version});
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
                res.sendStatus(200);
            } else {
                res.sendStatus(401);
            }
        });
    });

    return api;
}
