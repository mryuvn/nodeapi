var express = require("express");
var jsonParser = require("body-parser").json();
var router = express.Router();

var md5 = require('md5');
var random = require('../common/randomstring');
var api_secur = require('../common/api_secur');
var data_tables = require('../common/data_tb');
var countries_data = require('../common/countries_data');
var db_model = require('../models/db_models');

router.get("/", (req, res) => res.send("This is API"));

router.get("/login/:username/:password/:secur_key", (req, res) => {
    var secur_key = req.params.secur_key;
    if (secur_key == api_secur.secur) {
        username = req.params.username;
        password = req.params.password;
        password = md5(password + username);
        db = data_tables.table.mryu_user;
        fields = 'id, username, password, login_code, nickname, fullname, avatar, tel, email, level, webAdmin, hien_thi';
        where = 'WHERE username = "' + username + '"';
        db_model.getData(db, fields, where, '').then(data => {
            if (data.length > 0) {
                if (data[0].hien_thi == 0) {
                    res.json({ "mess": "userHasBeenLocked" });
                } else {
                    if (data[0].level == 'left') {
                        res.json({ "mess": "userOutOfWork" });
                    } else {
                        if (data[0].password == password) {
                            res.json({
                                "mess": "loginOK",
                                "userData": {
                                    "id": data[0].id,
                                    "username": data[0].username,
                                    "nickname": data[0].nickname,
                                    "fullname": data[0].fullname,
                                    "login_code": data[0].login_code,
                                    "avatar": data[0].avatar,
                                    "tels": data[0].tel,
                                    "emails": data[0].email,
                                    "level": data[0].level,
                                    "webAdmin": data[0].webAdmin
                                }
                            });
                        } else {
                            res.json({ "mess": "wrongPassword" });
                        }
                    }
                }
            } else {
                res.json({ "mess": "userNotFound" });
            }
        }).catch(err => res.json({ "mess": "fail", "err": err }));
    } else {
        res.json({
            "mess": "fail",
            "err": "No security key!"
        });
    }
});

router.get("/check-login/:username/:login_code/:secur_key", (req, res) => {
    var secur_key = req.params.secur_key;
    if (secur_key == api_secur.secur) {
        username = req.params.username;
        login_code = req.params.login_code;
        db = data_tables.table.mryu_user;
        fields = 'id, username, password, login_code, nickname, fullname, avatar, tel, email, level, webAdmin, hien_thi';
        where = 'WHERE username = "' + username + '"';
        db_model.getData(db, fields, where, '').then(data => {
            if (data.length > 0) {
                if (data[0].hien_thi == 0) {
                    res.json({ "mess": "userHasBeenLocked" });
                } else {
                    if (data[0].level == 'left') {
                        res.json({ "mess": "userOutOfWork" });
                    } else {
                        if (data[0].login_code == login_code) {
                            res.json({
                                "mess": "loginOK",
                                "userData": {
                                    "id": data[0].id,
                                    "username": data[0].username,
                                    "nickname": data[0].nickname,
                                    "fullname": data[0].fullname,
                                    "login_code": data[0].login_code,
                                    "avatar": data[0].avatar,
                                    "tels": data[0].tel,
                                    "emails": data[0].email,
                                    "level": data[0].level,
                                    "webAdmin": data[0].webAdmin
                                }
                            });
                        } else {
                            res.json({ "mess": "passwordHasBeenChanged" });
                        }
                    }
                }
            } else {
                res.json({ "mess": "userNotFound" });
            }
        }).catch(err => res.json({ "mess": "fail", "err": err }));
    } else {
        res.json({
            "mess": "fail",
            "err": "No security key!"
        });
    }
});

router.post("/reset-password", jsonParser, (req, res) => {
    if (req.body) {
        username = req.body.username;
        newPass = random.new(10, 'alphanumeric');
        password = md5(newPass + username);
        login_code = random.new(9, 'alphanumeric');
        db = data_tables.table.mryu_user;
        set = 'password = ?, login_code = ?';
        where = 'username';
        params = [password, login_code, username];
        db_model.editData(db, set, where, params)
            .then(result => res.json({
                "mess": "ok",
                "newPass": newPass
            })).catch(err => res.json({
                "mess": "fail",
                "err": 'Can not update your Password'
            }));
    } else {
        res.json({
            "mess": "fail",
            "err": "No data post received!"
        });
    }
});

router.get("/get-data", (req, res) => {
    var secur_key = req.query.secur_key;
    if (secur_key == api_secur.secur) {
        var db = req.query.db;
        if (db) {
            if (req.query.fields) {
                var fields = req.query.fields;
            } else {
                var fields = '*';
            }
            if (req.query.where) {
                var where = req.query.where;
            } else {
                var where = '';
            }
            if (req.query.orderBy) {
                var orderBy = req.query.orderBy;
            } else {
                var orderBy = '';
            }
            db_model.getData(db, fields, where, orderBy)
                .then(data => {
                    res.json({ "mess": "ok", "data": data });
                })
                .catch(err => res.json({ "mess": "fail", "err": err }));
        } else {
            res.json({ "mess": "fail", "err": "noDataTableSelected" });
        }
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

        var options = req.body.options;

        if (options.setCode) {
            fields.code = random.new(options.setCode.length, options.setCode.charset, options.setCode.capitalization);
        }

        if (options.setReference) {
            fields.reference = random.new(options.setReference.length, options.setReference.charset, options.setReference.capitalization);
        }

        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var date = time.getDate();

        if (options.setTime) {
            fields.createdTime = time;
        }

        if (options.setYear) {
            fields.year = year;
        }
        if (options.setMonth) {
            fields.month = month;
        }
        if (options.setDate) {
            fields.date = date;
        }

        if (options.setNum) {
            if (options.setNum == 'year') {
                var where = 'WHERE year = "' + year + '"';
            } else if (options.setNum == 'month') {
                var where = 'WHERE month = "' + month + '"';
            } else {
                var where = 'WHERE date = "' + date + '"';
            }
            db_model.getData(data_table, 'id', where, '')
                .then(data => {
                    fields.num = data.length + 1;
                    // res.json({fields: fields});
                    db_model.addData(data_table, fields)
                        .then(result => res.json({ 
                            "mess": "ok", 
                            "result": result, 
                            "code": fields.code,
                            "reference": fields.reference,
                            "year": fields.year,
                            "month": fields.month,
                            "date": fields.date,
                            "num": fields.num,
                            "createdTime": fields.createdTime 
                        }))
                        .catch(err => res.json({ "mess": "fail", "err": err }));
                }).catch(err => res.json({ "mess": "fail", "err": err }));
        } else {
            db_model.addData(data_table, fields)
                .then(result => res.json({ "mess": "ok", "result": result, "time": time }))
                .catch(err => res.json({ "mess": "fail", "err": err }));
        }
    } else {
        res.json({
            "mess": "fail",
            "err": "No data post received!"
        });
    }
});

router.post("/edit-data", jsonParser, (req, res) => {
    if (req.body) {
        let data_table = req.body.data_table;
        let set = req.body.set;
        let where = req.body.where;
        let params = req.body.params;
        db_model.editData(data_table, set, where, params)
            .then(result => res.json({ "mess": "ok", "result": result }))
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
        let data_table = req.body.data_table;
        let where = req.body.where;
        db_model.deleteData(data_table, where)
            .then(result => res.json({ "mess": "ok" }))
            .catch(err => res.json({
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

router.get("/get-site-values", (req, res) => {
    var db = data_tables.table.webs_site_value;
    var fields = '*';
    var where = req.query.where;
    var orderBy = '';
    db_model.getData(db, fields, where, orderBy)
        .then(data => {
            if (data.length > 0) {
                var values = data[0];
                if (values.tels) {
                    values.telArr = values.tels.split(' | ');
                } else {
                    values.telArr = [];
                }
                if (values.emails) {
                    values.emailArr = values.emails.split(' | ');
                } else {
                    values.emailArr = [];
                }
                if (values.hotlines) {
                    values.hotlineArr = values.hotlines.split(' | ');
                } else {
                    values.hotlineArr = [];
                }
                if (values.contacts) {
                    values.contactArr = [];
                    const ctArr = values.contacts.split(' | ');
                    ctArr.forEach(ct => {
                        const arr = ct.split(':');
                        if (arr.length > 0) {
                            values.contactArr.push({
                                type: arr[0],
                                value: arr[1]
                            });
                        }
                    });
                }
                res.json({ "mess": "ok", "data": values });
            } else {
                res.json({ "mess": "noData" });
            }

        }).catch(err => res.json({ "mess": "fail", "err": err }));
});

router.get("/get-currency-data", (req, res) => {
    var db = data_tables.table.mryu_currencies;
    var fields = '*';
    var where = '';
    var orderBy = '';
    db_model.getData(db, fields, where, orderBy)
        .then(data => {
            if (data.length > 0) {
                var currencies = data[0].content;
                if (currencies) {
                    var currenciesArr = currencies.split(' || ');
                    var currenciesData = [];
                    currenciesArr.forEach(e => {
                        let arr = e.split(' | ');
                        let newData = {
                            code: arr[0],
                            name: arr[1],
                            buy: arr[2],
                            transfer: arr[3],
                            sell: arr[4]
                        }
                        currenciesData.push(newData);
                    });
                    let vndData = {
                        code: 'VND',
                        name: 'VIETNAM DONG',
                        buy: '1',
                        transfer: '1',
                        sell: '1'
                    }
                    currenciesData.unshift(vndData);
                    res.json({ "mess": "ok", "data": currenciesData });
                } else {
                    res.json({"mess": "fail", "err": "noContent"});
                }
            } else {
                res.json({"mess": "fail", "err": "dataNotFound"});
            }
        })
        .catch(err => res.json({ "mess": "fail", "err": err }));
});

router.get("/get-countries-data", (req, res) => {
    var countriesData = countries_data.countries;
    res.json(countriesData);
});

router.post("/test-post-data", jsonParser, (req, res) => {
    // res.json(req.body);
    res.json({
        mess: 'Hello, post data is successfull!',
        data: req.body
    });
});

module.exports = router;