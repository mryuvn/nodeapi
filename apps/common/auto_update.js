var db_model = require('../models/db_models');
var request = require("request");
var cheerio = require("cheerio");

function updateCurrency () {
    var url = 'http://www.vietcombank.com.vn/exchangerates/ExrateXML.aspx';
    request(url, (err, response, body) => {
        if (err) {
            console.log(err);
        } else {
            var data = [];
            $ = cheerio.load(body);
            let dataList = $(body).find("exrate");
            dataList.each((i, e) => {
                let currencyData = [
                    e["attribs"]["currencycode"],
                    e["attribs"]["currencyname"],
                    e["attribs"]["buy"],
                    e["attribs"]["transfer"],
                    e["attribs"]["sell"]
                ]
                let currencyDataString = currencyData.join(' | ');
                data.push(currencyDataString);
            });
            let content = data.join(' || ');
            let time = new Date();
            let id = 1;
            let data_table = 'mryu_currencies';
            let set = 'content = ?, updateTime = ?';
            let where = 'id';
            let params = [content, time, id];
            db_model.editData(data_table, set, where, params)
            .then(result => console.log('Updated currencies data on ' + time))
            .catch(err => console.log(err));
        }
    }); 
}


module.exports = {
    updateCurrency: updateCurrency
};