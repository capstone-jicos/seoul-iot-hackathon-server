import {Router} from 'express';
import facets from '../models/facets';

export default ({config, db}) => {
    let router = Router();
    const model = facets(db.sequelize, db.Sequelize);

    router.get('/', (req, res) => {
        model.findAll().then(facets => {
            res.json(facets);
        });
    });

    router.get('/:id', ({ params }, res) => {
        model.findOne({
            where: {
                id: params.id
            }
        }).then(facet => {
            if (facet != null) {
                res.json(facet);
            } else {
                res.status(404).send("Not Found");
            }
        });
    });

    router.post('/', ({body}, res) => {
        model.upsert({
            id: body.id,
            value: body.value
        }).then(created => {
            res.json({"created": created});
        });
    });

    router.put('/:id', ({body, params}, res) => {
        model.update({
            value: body.value
        }, {
            where: {id: params.id}
        }).then(affected => {
            res.json(JSON.stringify({"afftected": affected}));
        });
    });

    return router;
};