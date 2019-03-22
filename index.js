var express = require('express');
var app = express();

app.use(delay);
app.use(express.static('docs'));

app.listen(3000);

function delay(req, res, next) {
    setTimeout(next, process.env.DELAY);
};