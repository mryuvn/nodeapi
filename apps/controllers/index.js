var express = require("express");
var router = express.Router();

router.use("/admin", require(__dirname + "/admin"));
router.use("/blog", require(__dirname + "/blog"));
router.use("/api", require(__dirname + "/api"));
router.use("/upload", require(__dirname + "/upload"));
router.use("/plugins", require(__dirname + "/plugins"));
router.use("/update-db-tools", require(__dirname + "/update_db_tools"));
router.use("/sendmail", require(__dirname + "/sendmail"));
router.use("/nodemailer", require(__dirname + "/nodemailer"));
router.use("/users", require(__dirname + "/users"));
router.use("/staffs", require(__dirname + "/test_staffs"));
router.use("/pages", require(__dirname + "/pages"));
router.use("/customers", require(__dirname + "/customers"));
router.use("/vfl-invoices", require(__dirname + "/vfl_invoices"));
router.use("/visa-orders", require(__dirname + "/visa_orders"));

router.get("/", function(req, res){
    // res.json({"message": "This is Homepage"});
    res.render("home");
});

router.get("/chat", function(req, res){
    res.render("chat");
});

router.get("/advices-request", (req, res) => res.render("advices-request"));

module.exports = router;