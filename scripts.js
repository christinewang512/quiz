/**
 * Created by christine on 3/31/15.
 */
/*var allQuestions = [
    {
        question: "The moon is a ?",
        choice: [
            "Comet",
            "Satellite",
            "Star",
            "Planet"
        ],
        answer: 1

    },
    {
        question: "Who receives Dronacharya Award?",
        choice: [
            "Scientists",
            "Movie actors",
            "Sports Coaches",
            "Sportsmen"
        ],
        answer: 2

    },
    {
        question: "Who was the first Indian to be-elected to the British Parliament?",
        choice: [
            "Dadabhai Naoroji",
            "Mothilal Nehru",
            "Mahathma Gandhi",
            "Gopalakrishna Gokhale"
        ],
        answer: 0

    },
    {
        question: "In which year India Joined the United Nations?",
        choice: [
            "1954",
            "1955",
            "1956",
            "1957"
        ],
        answer: 1

    },
    {
        question: "A hole is made in a brass plate and it is heated. The size of the hole will?",
        choice: [
            "increase",
            "decrease",
            "first increase and then decrease",
            "remain unchanged"
        ],
        answer: 2

    }
];*/

var elem_q = document.getElementById('question'),
    elem_next = document.getElementById('next'),
    elem_score = document.getElementById('score'),
    num,
    allQuestions = [];

window.onload = function(){
    // get question through json file
    loadJSON(function(response){
        allQuestions = JSON.parse(response);
        // initialize
        // show first question
        num = 0;
        showQuestion();

        // handle with next button
        elem_next.onclick = function () {
            if (num < allQuestions.length - 1) {
                num ++;
                showQuestion();
            } else {
                clearNode(elem_q);
                elem_q.innerHTML = '<p>Game Over</p><p>Your total score is ' + Number.parseInt(elem_score.innerText, 10) + '</p>';
            }
        };$
    });


}

function checkAnswer () {
    var elem_ul = document.getElementById('choices');
    var elem_choices = elem_ul.getElementsByTagName('a');
    var score = Number.parseInt(elem_score.innerText, 10);
    for (var i = 0; i < elem_choices.length; i++) {
        elem_choices[i].onclick = function (index) {
            return (function () {
                var answer = allQuestions[num].answer;

                // change selected answer to red if it is not the correct answer
                if (answer != index) {
                    elem_choices[index].style.color = 'red';
                } else {
                    elem_score.innerText = ++score;
                }

                // set correct answer to green
                elem_choices[answer].style.color = 'green';
                elem_choices[answer].style.fontWeight = 'bold';
                return false;
            });

        }(i);
    }
}

function showQuestion () {
    var question = allQuestions[num];

    // remove former question
    clearNode(elem_q);

    // add new question
    var fragment = document.createDocumentFragment();

    // create title element
    var elem_title = document.createElement('p');
    elem_title.setAttribute('id', 'title');
    elem_title.textContent = question.question;
    fragment.appendChild(elem_title);

    // create choice element
    var elem_choices = document.createElement('ul');
    elem_choices.setAttribute('id', 'choices');
    var choices = question.choice;
    for (var i = 0; i < choices.length; i++) {
        var elem_choice = document.createElement('li');
        var elem_choice_a = document.createElement('a');
        elem_choice_a.appendChild(document.createTextNode(choices[i]));
        elem_choice_a.href = '#';
        elem_choice.appendChild(elem_choice_a);
        elem_choices.appendChild(elem_choice);
    }
    fragment.appendChild(elem_choices);

    elem_q.appendChild(fragment);

    // bind click event on choices
    checkAnswer();

}

function clearNode (elem) {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
}

function loadJSON (callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'questions.json', true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == 200) {
          callback(xobj.responseText);
      }
    };
    xobj.send();
}