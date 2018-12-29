var q = require("q");
var db = require("../common/database");

var conn = db.getConnection();

function getData(fields) {
    var defer = q.defer();
    var query =  conn.query('SELECT ' + fields + ' FROM mryu_users', (err, user) => {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(user);
        }
    });
    return defer.promise;
}

function getDataByKey(fields, where) {
    var defer = q.defer();
    var query =  conn.query('SELECT ' + fields + ' FROM mryu_users WHERE ?', where, (err, user) => {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(user);
        }
    });
    return defer.promise;
}

function insert(params) {
    if (params) {
        var defer = q.defer();
        var query = conn.query('INSERT INTO mryu_users SET ?', params, (err, result) => {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}

function update(params) {
    if (params) {
        var defer = q.defer();
        var query = conn.query('UPDATE db_table SET ... WHERE ...', (err, result) => {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}


function updateStatus(params) {
    if (params) {
        var defer = q.defer();
        var query =  conn.query('UPDATE mryu_users SET status = ? WHERE id = ?', [params.status, params.id], (err, result) => {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}


module.exports = {
    getData: getData,
    getDataByKey: getDataByKey,
    insert: insert,
    update: update,
    updateStatus: updateStatus
}