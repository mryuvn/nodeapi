var express = require("express");
var jsonParser = require("body-parser").json();
var router = express.Router();
var dateTime = require('date-time');
var api_secur = require('../common/api_secur');

var staffs_md = require("../models/test_staffs_model");
var user_md = require("../models/user_model");

var db = require('../models/db_models');

router.get("/", (req, res) => {
    res.send("This is test Staffs API Page");
});

router.get("/get-all/:secur_key", (req, res) => {
    var secur_key = req.params.secur_key;
    if (secur_key == api_secur.secur) {
        let fields = '*';
        let data = staffs_md.get(fields);
        data.then(data => {
            // res.json(data);
            let newData = [];
            data.forEach(element => {
                //Set Gender
                if (element.gender=='m') {
                    var genderTitle = 'Male';
                } else {
                    var genderTitle = 'Female';
                }
                element.gender = {
                    value: element.gender,
                    title: genderTitle
                }

                //Set user
                let userFields = 'username, nickname';
                let userWhere = {id: element.id};
                let userData = user_md.getDataByKey(userFields, userWhere)
                userData.then(userData => {
                    element.userArr = userData;
                }).catch(err => {
                    element.userArr = [{"mess": "err"}];
                });

                newData.push(element);
            });
            res.json(newData);
        }).catch(err => res.json({"mess": "fail"}));
    } else {
        res.json({"mess": "This page is secured"});
    }
});


router.get("/update", (req, res) => {
    var id = req.query.id;
    var name = req.query.name;
    var gender = req.query.gender;
    var position = req.query.position;

    let set = 'name = ?, gender = ?, position = ?';
    let where = 'id';
    let params = [name, gender, position, id];
    db.editData('test_staffs', set, where, params)
    .then(data => {
        res.json({
            "mess": "ok",
            "data": data
        });
    }).catch(err => {
        res.json({
            "mess": "fail",
            "err": err
        });
    })

});

router.get("/delete", (req, res) => {
    let id = req.query.id;
    let table = 'test_staffs';
    let where = 'id = ' + id;
    
    db.deleteData('test_staffs', where)
    .then(result => res.send(result))
    .catch(err => {
        res.send(err);
        console.log(err);
    });
});

module.exports = router;