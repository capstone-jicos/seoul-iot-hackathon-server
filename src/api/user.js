import {Router} from 'express';
import sessionCheck from './session-check';
import UserModel from '../models/user';
import https from 'https';
import qs from 'querystring';

export default ({config, db}) => {
    let api = Router();
    const model = UserModel(db.sequelize, db.Sequelize);

    // 사용자 목록 가져오기
    api.get('/', ({session}, res) => {
        // if (sessionCheck(session, res)) {
            model.findAll({
                limit: 5,
                order: [['Index', 'DESC']]
            }).then(users => {
                const result = {
                    users: users
                };
                res.send(result);
            });
        // }
    });

    api.get('/:id', ({session, params}, res) => {
        if (sessionCheck(session, res)) {
            model.findOne({
                where: {
                    Index: params.id
                }
            }).then(user => {
                res.send(user);
            });
        }
    });

    api.post('/:id', ({body, session, params}, res) => {
        // if (sessionCheck(session, res)) {
            model.update({
                ID: body.id,
                PW: body.pw,
                Name: body.name,
                Role: body.role
            },{
                where:{Index: params.id}
            }).then(affected => {
                res.json({"affected": affected[0]});
            });
        // }
    });

    return api;
};