var express = require("express");
var jsonParser = require("body-parser").json();
var router = express.Router();

var api_secur = require('../common/api_secur');

var db = require('../models/db_models');
var pages_tb = 'mryu_page';
var data_tb = require('../common/data_tb');

router.get("/", (req, res) => res.send("This is Pages API"));

router.get("/get-data", (req, res) => {
    let secur_key = req.query.secur_key;
    if (secur_key == api_secur.secur) {
        let fields = '*';
        let where = '';
        db.getDataSync(pages_tb, fields, where)
        .then(data => res.json(data))
        .catch(err => res.json({"mess": err}));
    } else {
        res.json({
            "mess": "fail",
            "err": "No security key!"
        })
    }
});

router.get("/get-data-async", (req, res) => {
    let fields = '';
    let where = '';
    let data = db.getData(pages_tb, fields, where);
    // res.json(data);
    console.log(data);
});

router.post("/add-data", jsonParser, (req, res) => {
    if (req.body) {
        let fields = {
            alias: req.body.alias,
            ten: req.body.ten,
            name: req.body.name,
            ip: req.body.ip,
            mo_ta: req.body.mota,
            description: req.body.description,
            hien_thi: req.body.hienthi,
            noi_dung: req.body.noidung,
            noi_dung2: req.body.noidung2,
            user: req.body.user
        }
        // res.json(fields);
        db.addData(data_tb.table.mryu_page, fields)
        .then(data => {
            res.json({"mess": "ok", "result": data});
        }).catch(err => {
            res.json({
                "mess": "fail",
                "err": err
            });
        })
    } else {
        res.json({
            "mess": "fail",
            "err": "No data post received!"
        })
    }
});

router.post("/edit-data", jsonParser, (req, res) => {
    if (req.body) {
        let set = req.body.set;
        let where = req.body.where;
        let params = req.body.data;
        db.editData(data_tb.table.mryu_page, set, where, params)
        .then(data => res.json({"mess": "ok"}))
        .catch(err => res.json({
            "mess": "fail",
            "err": err
        }));
    } else {
        res.json({
            "mess": "fail",
            "err": "No data post received!"
        });
    }
});

router.post("/delete-data", jsonParser, (req, res) => {
    if (req.body) {
        let where = req.body.where;
        db.deleteData(data_tb.table.mryu_page, where)
        .then(result => res.json({
            "mess": "ok",
            "result": result
        })).catch(err => res.json({
            "mess": 'fail',
            "err": err
        }));
    } else {
        res.json({
            "mess": "fail",
            "err": "No data post received!"
        });
    }
});

module.exports = router;