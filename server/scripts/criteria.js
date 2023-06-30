const MyStem = require("../libs/MyStem");

async function informativeness(text, lemmas) {
    let count = 0;
    const features = ["называть", "означать", "называться", "обозначаться", "определяться", "пониматься"];
    for (const lemma of lemmas) {
      if (features.includes(lemma)) {
        count += 1;
        //break;
      }
    }
  
    const def_pattern = /[А-Яа-яёA-Za-z]+ - [А-Яа-яёA-Za-z]{2,}/;
    count += (text.match(def_pattern) || []).length;

    // console.log(count / lemmas.length);
    return count / lemmas.length;
}

async function abstractness(lemmas) {   
    let abstractWords = [], counter = 0; 
    for (const lemma of lemmas) {
        if(hasSuffix(lemma)){
            abstractWords.push({word: lemma, count: counter});
        }
        counter++;
    }
   // console.log(abstractWords.length/lemmas.length);
    return {criteria: abstractWords.length/lemmas.length, count: abstractWords.length, words: abstractWords};
}

function hasSuffix(text) {
    const suffixes = ['ние', 'ств', 'аци', 'есть', 'ость', 'изм', 'изн', 'ота', 'ина', 'ика', 'тив'];
    return suffixes.some((suffix) => text.endsWith(suffix));
}

async function waterContent(text, lemmas, stopWords) {
    let count = 0, arr = [], counter = 0;
    for(const i of lemmas){
        if (stopWords.includes(i)) {
            count += 1;
            arr.push({word: i, count: counter});
        }

        counter++;
    }
    //console.log("stopwords: " + count);
    return { count: count, criteria: count/lemmas.length, words: arr };
}

async function keywords(lemmas, kwcount) {
    let count, length = lemmas.length;
    let wordCount = new Map();
    lemmas.forEach(function(word) {
    let wordLower = word.toLowerCase();
        if(wordLower != ''){
            if (wordCount.has(wordLower)) {
                count = wordCount.get(wordLower);
                wordCount.set(wordLower, count + 1);
            } else {
                wordCount.set(wordLower, 1);
            }
        }
    });

    let sortedWords = Array.from(wordCount.entries()).sort(function(a, b) {
        return b[1] - a[1];
    }).slice(0, kwcount);

    let result = [];
    for(const i of sortedWords){
        result.push({word: i[0], count: i[1], criteria: i[1]/length});
    }

    // Выводим результат
    //console.log(result);

    return result;
}

async function academic(lemmas, rawl) {   
    let array = [], count = 0; 
    for (const lemma of lemmas) {
        if(rawl.includes(lemma)){
            array.push({word: lemma, count: count});
        }

        count++;
    }
    return {criteria: array.length/lemmas.length, count: array.length, words: array};
}

module.exports = { informativeness, abstractness, waterContent, keywords, academic }