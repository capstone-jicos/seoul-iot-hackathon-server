const sequelize = require('sequelize');
const db = require('../dist/models/index');
const SensorModel = require('../dist/models/sensor-value');
const SeatModel = require('../dist/models/seat');
const https = require('https');

let seated = false;
let buckled = false;

const gatewayId = "0165dca5e6d900000000000100100186";
const sensorId = [
    "conductivity-0165dca5e6d900000000000100100186-0",
    "number-0165dca5e6d900000000000100100186-0",
    "number-0165dca5e6d900000000000100100186-1",
    "number-0165dca5e6d900000000000100100186-2",
    "number-0165dca5e6d900000000000100100186-3"
];

const options = {
    hostname: "api.sandbox.thingplus.net",
    path: '/v2/gateways',
    method: "GET",
    headers: {
        "content-type": "application/json",
        "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIzMjIiLCJjbGllbnRJZCI6Imd1YXJkaWFucyIsImlhdCI6MTUzNjQxODUxNCwiZXhwIjoxNTM3NzE0NTE0fQ.eFf8KmwAJEBY9ia5AtBlpyvM8D_yvnXBUsYa3jVAiSo"
    }
};

function getSensorValue() {
    options.path = '/v2/gateways/' + gatewayId + '/sensors/' + sensorId[0] + '/series';
    let requestAuthCode = https.request(options, (authRes) => {
        let chunks = [];

        authRes.on('data', (chunk) => {
            chunks.push(chunk);
        });

        authRes.on('end', () => {
            let body = Buffer.concat(chunks);
            let response = JSON.parse(body.toString());
            let model = SensorModel(db.sequelize, db.Sequelize);
            let seatModel = SeatModel(db.sequelize, db.Sequelize);
            model.upsert({
                sensorId: sensorId[0],
                value: response.data.latest.value
            }).then(affected => {
                console.log(affected);
            });

            if (parseInt(response.data.latest.value) === 1) {
                buckled = true;
            }

            seatModel.update({
                buckled: buckled
            }, {
                where: {
                    id: 1
                }
            }).then(affected => {
                console.log(affected);
            });
        });
    });

    options.path = '/v2/gateways/' + gatewayId + '/sensors/' + sensorId[1] + '/series';
    let requestAuthCode1 = https.request(options, (authRes) => {
        let chunks = [];

        authRes.on('data', (chunk) => {
            chunks.push(chunk);
        });

        authRes.on('end', () => {
            let body = Buffer.concat(chunks);
            let response = JSON.parse(body.toString());
            let model = SensorModel(db.sequelize, db.Sequelize);
            model.upsert({
                sensorId: sensorId[1],
                value: response.data.latest.value
            }).then(affected => {
                console.log(affected);
            });

            if (response.data.latest.value >= 100) {
                seated = true;
            }
        });
    });


    options.path = '/v2/gateways/' + gatewayId + '/sensors/' + sensorId[2] + '/series';
    let requestAuthCode2 = https.request(options, (authRes) => {
        let chunks = [];

        authRes.on('data', (chunk) => {
            chunks.push(chunk);
        });

        authRes.on('end', () => {
            let body = Buffer.concat(chunks);
            let response = JSON.parse(body.toString());
            let model = SensorModel(db.sequelize, db.Sequelize);
            model.upsert({
                sensorId: sensorId[2],
                value: response.data.latest.value
            }).then(affected => {
                console.log(affected);
            });

            if (response.data.latest.value >= 100) {
                seated = true;
            }
        });
    });

    options.path = '/v2/gateways/' + gatewayId + '/sensors/' + sensorId[3] + '/series';
    let requestAuthCode3 = https.request(options, (authRes) => {
        let chunks = [];

        authRes.on('data', (chunk) => {
            chunks.push(chunk);
        });

        authRes.on('end', () => {
            let body = Buffer.concat(chunks);
            let response = JSON.parse(body.toString());
            let model = SensorModel(db.sequelize, db.Sequelize);
            model.upsert({
                sensorId: sensorId[3],
                value: response.data.latest.value
            }).then(affected => {
                console.log(affected);
            });

            if (response.data.latest.value >= 100) {
                seated = true;
            }
        });
    });

    options.path = '/v2/gateways/' + gatewayId + '/sensors/' + sensorId[4] + '/series';
    let requestAuthCode4 = https.request(options, (authRes) => {
        let chunks = [];

        authRes.on('data', (chunk) => {
            chunks.push(chunk);
        });

        authRes.on('end', () => {
            let body = Buffer.concat(chunks);
            let response = JSON.parse(body.toString());
            let model = SensorModel(db.sequelize, db.Sequelize);
            model.upsert({
                sensorId: sensorId[4],
                value: response.data.latest.value
            }).then(affected => {
                let seatModel = SeatModel(db.sequelize, db.Sequelize);
                let override = null;
                console.log(affected);

                if (seated !== false) {
                    override = false;
                }

                seatModel.update({
                    seated: seated,
                    override: override
                }, {
                    where: {
                        id: 2
                    }
                }).then(affected => {
                    console.log(affected);
                });
            });

            if (response.data.latest.value >= 100) {
                seated = true;
            }
        });
    });

    requestAuthCode.end();
    requestAuthCode1.end();
    requestAuthCode2.end();
    requestAuthCode3.end();
    requestAuthCode4.end();
}

getSensorValue();
setInterval(getSensorValue, 1000 * 60);
