import {Router} from 'express';
import sessionCheck from './session-check';
import BusModel from '../models/bus';
import SeatModel from '../models/seat';

export default ({config, db}) => {
    let api = Router();
    const model = BusModel(db.sequelize, db.Sequelize);

    // 버스 목록들 가져오기
    api.get('/', ({session}, res) => {
        // if (sessionCheck(session, res)) {
        const query = "select busIndex,busNum,name,rate\n" +
            "from ((select `index`, busNum from bus) a\n" +
            "    join (select busIndex, startTime, driverIndex from busLog) b on b.busIndex = a.`index`)\n" +
            "       join (select *\n" +
            "             from (select buckled / total * 100 'rate'\n" +
            "                   from (select count(*) 'total' from seat where\n" +
            "                                                            seated = true) d\n" +
            "                          join (select count(*) 'buckled' from seat where buckled = true) e) as f\n" +
            "                    join user) as u where b.driverIndex=u.index limit 5";
        model.sequelize.query(query).spread((results) => {
            res.send({buses:results});
        });
        // }
    });

    // 좌석 현황 확인
    api.get('/:id', ({session, params}, res) => {
        const seatModel = SeatModel(db.sequelize, db.Sequelize);
        let returnContent = {};

        seatModel.findAll({
            attributes: ['seatNum', 'seated', 'buckled', 'override'],
            where: {
                busId: params.id
            }
        }).then(results => {
            for (let i = 0; i < results.length; i++) {
                if (results[i].override) {
                    results[i].seated = true;
                    results[i].buckled = true;
                }
                results[i].override = undefined;
            }

            returnContent.seats = results;
            res.send(returnContent);
        });

        const query = "select busIndex, busNum, name, rate\n" +
            "from ((select `index`, busNum from bus) a\n" +
            "    join (select busIndex, startTime, driverIndex from busLog where busIndex = :id) b on b.busIndex = a.`index`)\n" +
            "       join (select *\n" +
            "             from (select buckled / total * 100 'rate'\n" +
            "                   from (select count(*) 'total' from seat where busId=:id and seated = true) d\n" +
            "                          join (select count(*) 'buckled' from seat where busId=:id and buckled = true) e) as f\n" +
            "                    join user) as u\n" +
            "where b.driverIndex = u.index\n" +
            "limit 5;";
        model.sequelize.query(query,{
            replacements:{
                id:params.id
            }
        }).spread((results) => {
            returnContent.meta = results[0];
        });
    });

    // Override 기능 사용
    api.post('/:id', ({session, params, body}, res) => {
        const seatModel = SeatModel(db.sequelize, db.Sequelize);

        seatModel.update({
            override: true
        }, {
            where: {
                busId: params.id,
                seatNum: body.seatNum
            }
        }).then(affected => {
            res.send({affected: affected[0]});
        });
    });
    return api;
};