var express = require("express");
var jsonParser = require("body-parser").json();
var router = express.Router();

var random = require('../common/randomstring');
var api_secur = require('../common/api_secur');
var db_model = require('../models/db_models');
var data_tb = require('../common/data_tb');
var count = require('../common/count');

router.get("/", (req, res) => res.send("This is VFL Invoices API"));

router.get("/get-data", (req, res) => {
    var secur_key = req.query.secur_key;
    if (secur_key == api_secur.secur) {
        var fields = '*';
        var id = req.query.id;
        var coCode = req.query.coCode;
        var year = req.query.year;
        if (id) {
            var where = 'WHERE id = "' + id + '"';
        } else if (coCode) {
            var where = 'WHERE coCode = "' + coCode + '"';
        } else if (year) {
            var where = 'WHERE year = "' + year + '"';
        } else {
            var where = '';
        }
        db_model.getDataSync(data_tb.table.vfl_invoices, fields, where)
        .then(data => {
            if (data=='') {
                res.json({
                    "mess": "fail",
                    "err": "dataNotFound"
                });
            } else {
                var newData = [];
                data.forEach(element => {
                    var productsArr = element.products.split(" |+| ");
                    element.products = [];
                    productsArr.forEach(e => {
                        var prArr = e.split(" | ");
                        var pr = {
                            prName: prArr[0],
                            prUnit: prArr[1],
                            prNumber: prArr[2],
                            prPrice: prArr[3],
                            prCount: prArr[2]*prArr[3]
                        }
                        element.products.push(pr);
                    });

                    var num = element.num;
                    if (num<10) {
                        var zero = '000000';
                    } else if (num<100) {
                        var zero = '00000';
                    } else if (num<1000) {
                        var zero = '0000';
                    } else if (num<10000) {
                        var zero = '000';
                    } else if (num<100000) {
                        var zero = '00';
                    } else if (num<1000000) {
                        var zero = '0';
                    } else {
                        var zero = '';
                    }
                    element.number = zero + num;

                    var totalPrice = [];
                    element.products.forEach(e => {
                        totalPrice.push(e.prCount);
                    });
                    element.totalPrice = totalPrice.reduce(count.add, 0);

                    newData.push(element);
                });
                res.json(newData);
            }
        }).catch(err => res.json({"mess": "fail", "err": err}));
    } else {
        res.json({
            "mess": "fail",
            "err": "No security key!"
        });
    }
});

router.post("/add-data", jsonParser, (req, res) => {
    if (req.body) {
        var data_table = req.body.data_table;
        var fields = req.body.fields;
        var date = new Date();
        var year = date.getFullYear();
        var where = 'WHERE year = "' + year + '"';
        db_model.getDataSync(data_table, 'id', where)
        .then(data => {
            fields.ref = random.new(10, 'alphanumeric');
            fields.year = year;
            fields.num = data.length+1;
            db_model.addData(data_table, fields)
            .then(result => res.json({"mess": "ok", "result": result}))
            .catch(err => res.json({"mess": "fail", "err": err}));
        }).catch(err => res.json({"mess": "fail", "err": err}));
    } else {
        res.json({
            "mess": "fail",
            "err": "No data post received!"
        })
    }
});

module.exports = router;