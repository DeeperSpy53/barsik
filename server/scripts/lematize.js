const MyStem = require('../libs/MyStem');

var myStem = new MyStem();
myStem.start(); // Run mystem in separate process

async function lemmatize(text) {
    //console.log(text);
    let arr = text.split(' '), promise, result = '', counter = 0;

    for (const i of arr) {
        promise = lemmatizeWord(i).then((res) => {
            //result = '' ? res:result + ' ' + res;
            arr[counter] = res;
        });

        await promise;
        counter++;
    }
    //console.log(arr);
    return arr;
}

async function lemmatizeWord(word){
    let promise = myStem.lemmatize(word).then(function(lemma){
        return lemma;
    });

    const result = await promise;
    return result;
}

module.exports = {lemmatize};