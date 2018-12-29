var express = require("express");
var jsonParser = require("body-parser").json();
var router = express.Router();

var md5 = require('md5');
var random = require('../common/randomstring');
var func = require('../common/func');
var api_secur = require('../common/api_secur');
var data_tables = require('../common/data_tb');
var countries_data = require('../common/countries_data');
var db_model = require('../models/db_models');

router.get("/", (req, res) => res.send("This is Update database tools"));

router.get("/customers", (req, res) => {
    var secur_key = req.query.secur_key;
    if (secur_key == api_secur.secur) {
        var db_table = data_tables.table.mryu_customers;
        var fields = '*';
        var where = '';
        var orderBy = '';
        db_model.getData(db_table, fields, where, orderBy)
            .then(data => {
                var results = [];
                var errors = [];
                data.forEach(e => {
                    e.checkName = func.getStringtify(e.name);
                    e.checkDeputy = func.getStringtify(e.deputy);
                    
                    let set = 'checkName = ?, checkDeputy = ?';
                    let where = 'id';
                    let params = [e.checkName, e.checkDeputy, e.id];
                    db_model.editData(db_table, set, where, params)
                        .then(result => {
                            let resultData = {
                                "id": e.id,
                                "result": result
                            }
                            results.push(resultData);
                            res.json({"results": results});
                        }).catch(error => {
                            let errData = {
                                "id": e.id,
                                "err": error
                            }
                            errors.push(errData);
                            res.json({"errors": errors});
                        });

                    // let item = {
                    //     "name": e.name,
                    //     "checkName": e.checkName,
                    //     "deputy": e.deputy,
                    //     "checkDeputy": e.checkDeputy
                    // }
                    // result.push(item);
                });
                // res.json({
                //     "result": results
                // });
            }).catch(err => {
                res.json({
                    "mess": "fail",
                    "err": err
                })
            })
    } else {
        res.json({
            "mess": "fail",
            "err": "No security key!"
        });
    }
})



module.exports = router;