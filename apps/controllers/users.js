var express = require("express");
var jsonParser = require("body-parser").json();
var router = express.Router();

var md5 = require('md5');
var random = require('../common/randomstring');

var api_secur = require('../common/api_secur');

var user_md = require("../models/user_model");

var db_model = require('../models/db_models');

var user_table = 'mryu_users';

router.get("/", function(req, res){
    res.json({"message": "This is USERS API page"});
});

router.get("/get-all-users/:secur_key", function(req, res){
    var secur_key = req.params.secur_key;
    if (secur_key == api_secur.secur) {
        var fields = '*';
        var data = user_md.getData(fields);
        data.then(data => res.json(data))
        .catch(err => res.json({"mess": "fail"}));
    } else {
        res.json({"mess": "This page is secured"});
    }
});

router.get("/get-by-id/:id", (req, res) => {
    var id = req.params.id;
    var fields = '*';
    var where = {id: id};
    var data = user_md.getDataByKey(fields, where);
    data.then(data => res.json(data))
    .catch(err => res.json({"mess": "fail"}));
});

router.get("/get-by-username/:username", (req, res) => {
    var username = req.params.username;
    var fields = '*';
    var where = {username: username};
    var data = user_md.getDataByKey(fields, where);
    data.then(data => res.json(data))
    .catch(err => res.json({"mess": "fail"}));
});

router.get("/get-user-login/:id", (req, res) => {
    var id = req.params.id;
    var fields = 'id, username, login_code, avatar, nickname, fullname, arrivalDate, status, level, hien_thi';
    var where = {id: id};
    var data = user_md.getDataByKey(fields, where);
    data.then(data => res.json(data))
    .catch(err => res.json({"mess": "fail"}));
});

router.get("/get-user-sign-in", (req, res) => {
    var secur = req.query.api_security;
    if (secur == api_secur.secur) {
        var id = req.query.id;
        var username = req.query.username;
        var fields = 'id, username, login_code, avatar, nickname, fullname, arrivalDate, status, level, hien_thi';
        if (id) {
            var where = {id: id};
        } else if (username) {
            var where = {username: username};
        } else {
            var where = '';
        }
        if (where) {
            var data = user_md.getDataByKey(fields, where);
            data.then(data => res.json(data))
            .catch(err => res.json({"mess": "fail"}));
        } else {
            res.json({"mess": "fail"});
        }
    } else {
        res.json({"mess": "securityFail"});
    }
});

router.get("/sign-in/:username/:password/:onStatus/:secur_key", (req, res) => {
    var username = req.params.username;
    var password = req.params.password;
    var password = md5(password + username);
    var status = req.params.onStatus;
    var secur_key = req.params.secur_key

    if (secur_key == api_secur.secur) {
        if (username=='na') {
            res.json({"mess": "userNotFound"});
        } else {
            var fields = 'id, username, password, login_code, nickname, fullname, avatar, status, level, webAdmin, hien_thi';
            var where = {username: username};
            var data = user_md.getDataByKey(fields, where);
            data.then(data => {
                if (data=='') {
                    res.json({"mess": "userNotFound"});
                } else {
                    if (data[0].hien_thi == 0) {
                        res.json({"mess": "userHasBeenLocked"});
                    } else {
                        if (data[0].level == 'left') {
                            res.json({"mess": "userOutOfWork"});
                        } else {
                            if (data[0].password==password) {
                                var params = {
                                    id: data[0].id,
                                    status: status
                                }
                                var updated = user_md.updateStatus(params)
                                if (!updated) {
                                    let newStatus = data[0].status;
                                    res.json({
                                        "mess": "loginOK",
                                        "userData": {
                                            "id": data[0].id,
                                            "username": data[0].username,
                                            "nickname": data[0].nickname,
                                            "fullname": data[0].fullname,
                                            "login_code": data[0].login_code,
                                            "avatar": data[0].avatar,
                                            "status": newStatus,
                                            "level": data[0].level,
                                            "webAdmin": data[0].webAdmin
                                        }
                                    });
                                }
                                else {
                                    updated.then(result => {
                                        let newStatus = status;
                                        res.json({
                                            "mess": "loginOK",
                                            "userData": {
                                                "id": data[0].id,
                                                "username": data[0].username,
                                                "nickname": data[0].nickname,
                                                "fullname": data[0].fullname,
                                                "login_code": data[0].login_code,
                                                "avatar": data[0].avatar,
                                                "status": newStatus,
                                                "level": data[0].level,
                                                "webAdmin": data[0].webAdmin
                                            }
                                        });
                                    }).catch(err => {
                                        let newStatus = data[0].status;
                                        res.json({
                                            "mess": "loginOK",
                                            "userData": {
                                                "id": data[0].id,
                                                "username": data[0].username,
                                                "nickname": data[0].nickname,
                                                "fullname": data[0].fullname,
                                                "login_code": data[0].login_code,
                                                "avatar": data[0].avatar,
                                                "status": newStatus,
                                                "level": data[0].level,
                                                "webAdmin": data[0].webAdmin
                                            }
                                        });
                                    });
                                }
                            } else {
                                res.json({"mess": "wrongPassword"});
                            }
                        }
                    }
                }
            })
            .catch(err => res.json({"mess": "fail"}));
        }
    } else {
        res.json({"mess": "fail"});
    }

});

router.get("/check-login/:id/:login_code", (req, res) => {
    var id = req.params.id;
    var login_code = req.params.login_code;
    var fields = 'id, username, login_code, nickname, status, level, hien_thi';
    var where = {id: id};
    var data = user_md.getDataByKey(fields, where);
    data.then(data => {
        if (data=='') {
            res.json({"mess": "fail"});
        } else {
            if (data[0].hien_thi == 0) {
                res.json({"mess": "userHasBeenLocked"});
            } else {
                if (data[0].level == 'left') {
                    res.json({"mess": "userOutOfWork"});
                } else {
                    if (data[0].login_code != login_code) {
                        res.json({"mess": "passwordHasBeenChanged"});
                    } else {
                        res.json({
                            "mess": "loginOK",
                            "userData": {
                                "id": data[0].id,
                                "username": data[0].username,
                                "nickname": data[0].nickname,
                                "status": data[0].status
                            }
                        });
                    }
                }
            }
        }
    })
    .catch(err => res.json({"mess": "fail"}));
});

router.get("/check-user", (req, res) => {
    var id = req.query.id;
    var username = req.query.username;
    var fields = 'id, username, nickname, registrationEmail';
    if (id) {
        var where = {id: id};
    } else if (username) {
        var where = {username: username};
    } else {
        var where = '';
    }

    if (where) {
        var data = user_md.getDataByKey(fields, where);
    } else {
        var data = user_md.getData(fields);
    }

    data.then(data => {
        if (data == '') {
            res.json({"mess": "userNotFound"});
        } else {
            res.json({
                "mess": "ok",
                "userData": data
            });
        }
    }).catch(err => res.json({"mess": "fail"}));
});

router.get("/get-user-for-finder", (req, res) => {
    var id = req.query.id;
    var username = req.query.username;
    var fields = 'id, username, nickname, fullname';
    if (id) {
        var where = {id: id};
    } else if (username) {
        var where = {username: username};
    } else {
        var where = '';
    }

    if (where) {
        var data = user_md.getDataByKey(fields, where);
    } else {
        var data = user_md.getData(fields);
    }

    data.then(data => {
        if (data == '') {
            res.json({"mess": "userNotFound"});
        } else {
            res.json({
                "mess": "ok",
                "userData": data
            });
        }
    }).catch(err => res.json({"mess": "fail"}));
})

router.get("/update-user-status/:id/:status", (req, res) => {
    // var params = {
    //     id: req.params.id,
    //     status: req.params.status
    // }
    // var data = user_md.updateSratus(params)
    // if (!data) {
    //     res.json({status_code: 500});
    // }
    // else {
    //     data.then(result => {
    //         res.json({status_code: 200});
    //     }).catch(err => res.json({status_code: 500}));
    // }
});

router.post("/sign-in", jsonParser, (req, res) => {
    res.send(req.body);
});



router.post("/reset-password", jsonParser, (req, res) => {
    var params = req.body;
    if (params) {
        var username = params.username;
        var email = params.registerEmail;
        var fields = 'id, username, registrationEmail, level, hien_thi';
        var where = 'WHERE username = "'+username+'"';
        db_model.getData(user_table, fields, where, '')   
        .then(data => {
            if (data=='') {
                res.json({"mess": "userNoteFound"});
            } else {
                if (data[0].level=='left' || data[0].hien_thi=='0') {
                    res.json({"mess": "userHasLeft"});
                } else {
                    if (data[0].registrationEmail==email) {
                        let id = data[0].id;
                        let newPass = random.new(10, 'alphanumeric');
                        let password = md5(newPass + username);
                        let login_code = random.new(9, 'alphanumeric');
                        let set = 'password = ?, login_code = ?';
                        let where = 'id';
                        let params = [password, login_code, id];
                        db_model.editData(user_table, set, where, params)
                        .then(result => res.json({
                            "mess": "ok",
                            "newPass": newPass
                        })).catch(err => res.json({
                            "mess": "fail",
                            "err": 'Can not update new Password'
                        }));
                    } else {
                        res.json({"mess": "emailNotRight"});
                    }
                }
            }
        }).catch(err => res.json({"mess": "fail", "err": err}));   
    } else {
        res.json({"mess": "fail"});
    }
});

router.post("/change-password", jsonParser, (req, res) => {
    if (req.body) {
        let id = req.body.id;
        let newPass = req.body.newPassword;
        let password = md5(req.body.newPassword + req.body.username);
        let login_code = random.new(9, 'alphanumeric');
        let set = 'password = ?, login_code = ?';
        let where = 'id';
        let params = [password, login_code, id];
        db_model.editData(user_table, set, where, params)
        .then(result => res.json({
            "mess": "ok",
            "newPass": newPass
        })).catch(err => res.json({
            "mess": "fail",
            "err": "Can not update your new Password"
        }));
    } else {
        res.json({"mess": "fail", "err": "No data posted!"});
    }
});


router.post("/add-user", jsonParser, (req, res) => {
    if (req.body) {
        let fields = req.body;
        fields.code = random.new(9, 'alphanumeric');
        let pass = md5(fields.password+fields.username);
        fields.password = pass;
        fields.login_code = random.new(9, 'alphanumeric');
        let time = new Date();
        fields.arrivalDate = time;
        db_model.addData(user_table, fields)
        .then(result => res.json({"mess": "ok", "result": result}))
        .catch(err => res.json({"mess": "fail", "err": err}));
    } else {
        res.json({"mess": "fail", "err": "No data posted!"});
    }
});

module.exports = router;