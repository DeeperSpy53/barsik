const fs = require("fs");
const { parse } = require("csv-parse");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const lem = require('./scripts/lematize.js');
const crt = require('./scripts/criteria.js')
// lem.lemmatize('Управляйся и беги'); // test

app.use(express.static(__dirname));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());

let data = [];

let stopWrds = fs.readFileSync('stopwords.txt', { encoding: "utf-8" });
let stopWords = stopWrds.split(',');

let rawl = fs.readFileSync('rawl.txt', { encoding: "utf-8" });
let rawlWords = rawl.split(',');

/*rawl = rawl.replace(/[0-9]/g, '');
rawl = rawl.replace(/\"[^""]*\"/g, '');
fs.writeFileSync('rawl.txt', rawl, { encoding: "utf-8" });*/

fs.createReadStream("./lemmas.csv")
    .pipe(parse({ delimiter: ",", columns: true }))
    .on("data", function(row) {
        data.push(row);
    })
    .on("error", function (error) {
        console.log(error.message);
    })
    .on("end", function () {
        console.log("finished");
        //console.log(data);
    });

app.post('/get', async (req, res) => {
    let info, abcount, abcriteria, abwords = [], swcount, swcriteria, swwords = [], keywords = [], academicCount, academicWords = [], academicCriteria;

    let lemmText = [];
    let promise = lem.lemmatize(req.body.text).then((res) => {
        lemmText = res;
    });
    await promise;

    promise = crt.informativeness(req.body.text, lemmText).then((res) => {
        info = res;
    });
    await promise;

    promise = crt.abstractness(lemmText).then((res) => {
        abcount = res.count;
        abcriteria = res.criteria;
        abwords = res.words;
    });
    await promise;

    promise = crt.waterContent(req.body.text, lemmText, stopWords).then((res) => {
        swcount = res.count;
        swcriteria = res.criteria;
        swwords = res.words;
    });
    await promise;

    promise = crt.keywords(lemmText, req.body.keywords).then((res) => {
        keywords = res;
    });
    await promise;

    promise = crt.academic(lemmText, rawlWords).then((res) => {
        academicCount = res.count;
        academicWords = res.words;
        academicCriteria = res.criteria;
    });
    await promise;

    res.send({count: lemmText.length, swcount: swcount, swcriteria, swcriteria, swwords: swwords, abcount: abcount, abwords: abwords, abcriteria: abcriteria, keywords: keywords, academiccount: academicCount, academicwords: academicWords, academiccriteria: academicCriteria});
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Server started');
});