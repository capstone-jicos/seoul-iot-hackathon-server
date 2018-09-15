import {Router} from 'express';
import sessionCheck from './session-check';
import BusModel from '../models/bus';

export default ({config, db}) => {
    let api = Router();
    const model = BusModel(db.sequelize, db.Sequelize);

    api.get('/', ({session}, res) => {
        // if (sessionCheck(session, res)) {
            model.findAll({
                limit: 5,
                order: [['Index', 'DESC']]
            }).then((buses) => {
                const result = {
                    buses: buses
                };
                res.send(result);
            });
        // }
    });

    api.get('/:id', ({session, params}, res) => {
        // TODO 버스 현황 정보도 같이 넣어줘야함 (JOIN 테이블)
        // TODO
        let query="select * from (select sensorId, seatId, busId from (select * from seat where seat.id= :id ) as a join sensorProfile on a.id=sensorProfile.seatId) as b inner join sensorValue on b.sensorId=sensorValue.sensorId;"
        let replacement = {
            id: params.id
        };
        db.sequelize.query(query, {replacements: replacement}).spread((results, metadata) => {
            res.send(results);
        });
    });

    return api;
};