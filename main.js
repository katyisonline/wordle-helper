const dUrl = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/';
const dKey = '?key=dc9c62d8-578c-4a8c-9d0f-c12d7f50edb9';
const alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
let counter = 0;
let filtered = [];
let keyLetters = new Map();


// bounce animation on hover
$("h1").on("mouseover", function () {
    $("#wordle").addClass('bounce');

    setTimeout(function () {
        $("#wordle").removeClass('bounce');
    }, 2000);
})



$('#clear').click(function () {
    // removing all data
    $('#output').empty()
    $('#output').removeClass('show')
    // clearing text fields
    $("#s0").val(''), $("#s1").val(''), $("#s2").val(''), $("#s3").val(''), $("#s4").val('')
})



function genWord() {
    // gather all input fields
    let firstInput = [$("#s0").val(), $("#s1").val(), $("#s2").val(), $("#s3").val(), $("#s4").val()];
    // convert to lowercase
    const start = firstInput.map(input => input.toLowerCase());

    for (let i = 0; i < start.length; i++) {
        // non empty fields added to a map with their corresponding index
        if (start[i] !== '') {
            keyLetters.set(i, start[i]);
        }
    }
    // random letters generated where there are none
    for (let i = 0; i < start.length; i++) {
        if (start[i] === '') {
            let newLetter = alpha[Math.floor(Math.random() * 27)];
            start[i] = newLetter;
        }
    }

    // concatenating the array into a new string to use for get req
    let newWord = start.join();
    let word = newWord.replace(/,/g, '');
    check(word, keyLetters);
}



async function check(word, original) {
    // request is made 50 times
    if (counter < 50) {
        ++counter;

        let index = Array.from(original.keys());
        let letter = Array.from(original.values());
        let wordSearch = dUrl + word + dKey;

        let response = await $.get(wordSearch,
            function (data, textStatus, jqXHR) {
                let result = data;
                for (let i = 0; i < result.length; i++) {
                    // only including responses with a length of 5 char
                    if (result[i].length === 5) {
                        // eliminating any spaced and hypenated responses
                        if (result[i].indexOf('-') === -1 && result[i].indexOf(' ') === -1) {
                            // flag is initialized as true
                            let flag = true;
                            for (let j = 0; j < result[i].length; j++) {
                                if (result[i][index[j]] !== letter[j]) {
                                    // if the letter is not at correct index, flag is then false
                                    flag = false;
                                    break;
                                }
                            }
                            // if flag is still true and the word is not already in array, it is added
                            if (flag && !filtered.includes(result[i].toLowerCase())) {
                                filtered.push(result[i].toLowerCase());
                            }
                        }
                    }
                }
            })
        genWord();
    }
    else {
        display(filtered);
    }
}



function display(data) {
    // if there is data, it is output
    if (data.length !== 0) {
        $('#output').addClass('show');

        let resTitle = $('<h2></h2>');
        resTitle.addClass('title');
        resTitle.text('Possible answers are...');

        let resSubtitle = $('<h3></h3>');
        resSubtitle.addClass('subTitle');
        resSubtitle.text('(Click on results to eliminate!)')

        $('#output').prepend(resTitle, resSubtitle);

        var list = $('<ul></ul>');
        list.addClass('data-list')

        for (let i = 0; i < data.length; i++) {
            let dataLi = $('<li></li>');
            dataLi.addClass('data-list-item');
            dataLi.text(data[i]);
            list.append(dataLi);
        }

        $('#output').append(list);
    } else {
        // otherwise alert is shown
        let errData = $('<p></p>');
        errData.addClass('error');
        errData.text('Sorry! No results found.');
        $('#output').append(errData);
    }
}


// function to 'eliminate' words that don't work
$('#output').on('click', '.data-list-item', function () {
    $(this).css('color', '#eb81c7');
});

