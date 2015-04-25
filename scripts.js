/**
 * Created by christine on 3/31/15.
 */
var allQuestions = [
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
];

// Event Util
var EventUtil = {
    addEvent : function (elem, type, handler) {
        if (addEventListener) {
            elem.addEventListener(type, handler, false);
        } else if (attachEvent) {
            elem.attachEvent(type, handler);
        } else {
            elem[type] = handler;
        }
    },

    removeEvent: function (elem, type, handler) {
        if (removeEventListener) {
            elem.removeEventListener(type, handler, false);
        } else if (detachEvent) {
            elem.detachEvent(type, handler);
        } else {
            elem[type] = null;
        }
    }

};

var elem_q = document.getElementById('question'),
    elem_next = document.getElementById('next'),
    elem_back = document.getElementById('back'),
    elem_error = document.getElementById('error'),
    num,
//    allQuestions = [],
    results = [];

window.onload = function(){
  /*  // get question through json file
    loadJSON(function(response){
        allQuestions = JSON.parse(response);
        // initialize
        // show first question
        num = 0;
        showQuestion();

        // handle with next button
        EventUtil.addEvent(elem_next, 'click', next);

        // handle with back button
        EventUtil.addEvent(elem_back, 'click', back);
    }); */

    // initialize
    // show first question
    num = 0;
    showQuestion();

    // handle with next button
    EventUtil.addEvent(elem_next, 'click', next);

    // handle with back button
    EventUtil.addEvent(elem_back, 'click', back);

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

function next () {
    // check whether question is answered
    if (validateChoice()) {
        // remove error
        elem_error.innerHTML = "";

        num ++;
        // if the question is not the last question, show next question
        if (num < allQuestions.length) {
            showQuestion();
        }
        // else show the final score
        else {
            clearNode(elem_q);
            elem_q.innerHTML = '<p>Game Over</p><p>Your total score is ' + getScore() + '</p>';
            checkBtnVisibility();
        }
    } else {
        elem_error.innerHTML = 'Please choose an answer.'
    }
}

function back () {
    if (num > 0) {
        num --;
        showQuestion();
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
        // checkbox
        var elem_choice_checkbox = document.createElement('input');
        var cId = num + '-' + i;
        setAttributes(elem_choice_checkbox, {'type':'checkbox', 'class':'checkbox', 'id':cId});
        elem_choice.appendChild(elem_choice_checkbox);

        // choice content
        var elem_choice_content = document.createTextNode(choices[i]);
        elem_choice.appendChild(elem_choice_content);

        elem_choices.appendChild(elem_choice);
    }
    fragment.appendChild(elem_choices);

    elem_q.appendChild(fragment);

    var checkboxs = document.getElementsByClassName('checkbox');

    // check button visibility
    checkBtnVisibility();

    // show checked answer
    showCheckedAnswer(checkboxs);

    // bind checkbox handler
    for (var j = 0, len = checkboxs.length; j < len; j++) {
        EventUtil.addEvent(checkboxs[j], 'click', recordAnswer);
    }
}

function checkBtnVisibility () {
    // if current question is the first question, disable the back button.
    if (num == 0) {
        elem_back.disabled = true;
        return;
    }

    // if current page is not the question page, disable the back and next buttons.
    if (num == allQuestions.length) {
        elem_back.disabled = true;
        elem_next.disabled = true;
        return;
    }

    // for other situations, enable the back and next buttons.
    elem_back.disabled = false;
    elem_next.disabled = false;
}

function showCheckedAnswer (checkboxs) {
    // check whether already had answered current question
    for (var i = 0,len = results.length; i < len; i++) {
        if (results[i].questionNum == num) {
            checkboxs[results[i].answerNum].checked = true;
        }
    }
}

function recordAnswer () {
    var parts = this.id.split('-');
    var result = {
        questionNum : parts[0],
        answerNum : parts[1]
    };
    results.push(result);
}

function getScore () {
    for (var i = 0, len = results.length; i < len; i++) {
        var result = results[i],
            score = 0;
        console.log(result.answerNum, allQuestions[result.questionNum].answer);
        if (result.answerNum == allQuestions[result.questionNum].answer) {
            score += 10;
        }
    }
    return score;
}

function clearNode (elem) {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
}

function validateChoice () {
    var checkboxs = document.getElementsByClassName('checkbox');
    for (var i = 0, len = checkboxs.length; i < len; i++) {
        var thisCheckbox = checkboxs[i];
        if (thisCheckbox.checked) {
            return true;
        }
    }
    return false;
}

function setAttributes (elem, attrs) {
    for (var key in attrs) {
        elem.setAttribute(key, attrs[key]);
    }
}