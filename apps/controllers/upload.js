var express = require("express");
var router = express.Router();
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../static/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

var upload = multer({ storage: storage });

router.get("/", (req, res) => res.send("This is Upload files API"));

router.post("/images", upload.single("file"), (req, res) => {
    console.log(req.file);
    res.send("UPLOAD SUCCESS!");
});

module.exports = router;