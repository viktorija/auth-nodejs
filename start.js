'use strict';

const express = require('express'),
bodyParser = require('body-parser');

const app = express();

const cookieParser = require('cookie');
const crypto = require('crypto-js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('./public'));


const SECRET = 'Any string for password';

function hashOf(value) {
    return crypto.HmacSHA256(value.toString(), SECRET).toString();
}


app.get('/visitors', (req, res) => {
    // read cookie

    const cookieHeaderValue = req.header('cookie') || '';
    const visitCount = cookieParser.parse(cookieHeaderValue).visitCount;

    const [value, hash] = visitCount.split('|');

    const count = (!isNaN(value)) && hashOf(value) === hash ? parseInt(value) + 1 : 1;

    console.log(count.toString() + '|' + hash);

    const hashfromBrowser = hashOf(count);

    const cookieValue = count.toString() + '|' + hashfromBrowser;
    res.cookie('visitCount', cookieValue);

    res.render('visits', { visitCount: count });
});





app.use('/visits', require('./lib/visitors'));

app.get('/', (req, res) => {
res.render('index');
});


app.listen(3333, () => {
console.log('Listening...');
});



