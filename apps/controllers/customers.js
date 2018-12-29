var express = require("express");
var jsonParser = require("body-parser").json();
var router = express.Router();

var random = require('../common/randomstring');
var api_secur = require('../common/api_secur');
var db_model = require('../models/db_models');
var data_tb = require('../common/data_tb');

router.get("/", (req, res) => res.send("This is customers API"));

router.get("/get-for-finder", (req, res) => {
    var secur_key = req.query.secur_key;
    if (secur_key == api_secur.secur) {
        var id = req.query.id;
        var co_code = req.query.co_code;
        if (id) {
            var where = 'WHERE id = "' + id + '"';
        } else if (co_code) {
            var where = 'WHERE co_code = "' + co_code + '"';
        } else {
            var where = '';
        }
        var fields = 'id, ten, tel, email, co_name, co_add, co_code';
        db_model.getDataSync(data_tb.table.mryu_customers,fields, where)
        .then(data => {
            if (data=='') {
                res.json({
                    "mess": "fail",
                    "err": "No data found"
                });
            } else {
                var newData = [];
                data.forEach(element => {
                    element.tenArr = element.ten.split(" | ");
                    element.telArr = element.tel.split(" | ");
                    element.emailArr = element.email.split(" | ");
                    
                    newData.push(element);
                });
                res.json(newData);
            }
        })
        .catch(err => res.json({"mess": 'fail', "err": err}));
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
            fields.ref = random.new(10, 'alphanumeric');

        res.json({
            "mess": "ok",
            "data_table": data_table,
            "fields": fields
        })
        // db_model.addData(data_table, fields)
        // .then(result => res.json({"mess": "ok", "result": result}))
        // .catch(err => res.json({"mess": "fail", "err": err}));
    } else {
        res.json({
            "mess": "fail",
            "err": "No data post received!"
        })
    }
});

module.exports = router;