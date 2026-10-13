function countBs(word) {

    if (typeof word !== "string") {
        return console.log("Argument must be a string");
    }

    let numBs = 0;
    for (let index = 0; index < word.length; index++) {
        if (word[index] === "B") {
            numBs += 1;
        }
    }

    return numBs;
}


function countChar(word, char) {

    if (typeof word !== "string") {
        return console.log("Argument must be a string");
    }

    let numChar = 0;
    for (let index = 0; index < word.length; index++) {
        if (word[index] === char) {
            numChar += 1;
        }
    }

    return numChar;

    
}

console.log(countBs("BOB"));
// → 2
console.log(countChar("kakkerlak", "k"));
// → 4