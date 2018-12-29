var q = require("q");
var db = require("../common/database");

var conn = db.getConnection();

var data_table = 'test_staffs';

function get(fields) {
    var defer = q.defer();
    var query =  conn.query('SELECT ' + fields + ' FROM ' + data_table, (err, result) => {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(result);
        }
    });
    return defer.promise;
}

function add(a, b) {
    var defer = q.defer();
    if (a && b) {
        defer.resolve(a+b);
    } else {
        defer.reject('Fail');
    }
    return defer.promise;
}

module.exports = {
    get: get,
    add: add
}