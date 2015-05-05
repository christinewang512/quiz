/**
 * Created by christine on 3/31/15.
 */

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
    elem_c = document.getElementById('choices'),
    elem_next = document.getElementById('next'),
    elem_back = document.getElementById('back'),
    elem_error = document.getElementById('error'),
    num,
    allQuestions = [],
    results = [];

window.onload = function(){
    // get question through json file
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
    });

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
    // if not show the error msg
    if (validateAnswerAndRecord()) {
        // hide error
        elem_error.style.display = 'none';

        num ++;
        // if the question is not the last one, show next question
        if (num < allQuestions.length) {
            showQuestion();
        }
        // else show the final score
        else {
            clearNode(elem_q);
            elem_q.innerHTML = '<p>Game Over</p>';
            elem_c.innerHTML = '<p class="result">Your total score is <span>' + getScore() + '</span> !</p>';
            checkBtnVisibility();
        }
    } else {
        elem_error.style.display = 'block';
        elem_error.innerHTML = 'Please choose an answer.'
    }
}

function back () {
    validateAnswerAndRecord();

    if (num > 0) {
        num --;
        showQuestion();
    }
}

function showQuestion () {
    var question = allQuestions[num];

    // remove former question
    clearNode(elem_q, elem_c);

    // show question
    var elem_title = document.createElement('p');
    elem_title.setAttribute('id', 'title');
    elem_title.textContent = question.question;
    elem_q.appendChild(elem_title);

    // show choices
    var elem_choices = document.createElement('ul');
    var choices = question.choice;
    for (var i = 0; i < choices.length; i++) {
        var elem_choice = document.createElement('li');
        // checkbox
        var elem_choice_checkbox = document.createElement('input');
        var cId = num + '-' + i;
        setAttributes(elem_choice_checkbox, {'type':'radio', 'name':'choices', 'value':cId});
        elem_choice.appendChild(elem_choice_checkbox);

        // choice content
        var elem_choice_content = document.createTextNode(choices[i]);
        elem_choice.appendChild(elem_choice_content);

        elem_choices.appendChild(elem_choice);
    }
    elem_c.appendChild(elem_choices);

    var radioInputs = document.getElementsByName('choices');

    // check button visibility
    checkBtnVisibility();

    // show checked answer
    showCheckedAnswer(radioInputs);

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

function showCheckedAnswer (inputs) {
    // if current question had been answered, then display the answer
    for (var i = 0,len = results.length; i < len; i++) {
        if (results[i].questionNum == num) {
            inputs[results[i].answerNum].checked = true;
        }
    }
}

function getScore () {
    var score = 0;
    for (var i = 0, len = results.length; i < len; i++) {
        var result = results[i];
        console.log(result.answerNum, allQuestions[result.questionNum].answer);
        if (result.answerNum == allQuestions[result.questionNum].answer) {
            score += 10;
        }
    }
    return score;
}

function clearNode () {
    for (var i = 0, len = arguments.length; i < len; i++) {
        var elem = arguments[i];
        while (elem.firstChild) {
            elem.removeChild(elem.firstChild);
        }
    }
}

function validateAnswerAndRecord () {
    var radioInputs = document.getElementsByName('choices');
    for (var i = 0, len = radioInputs.length; i < len; i++) {
        if (radioInputs[i].checked) {
            var val = radioInputs[i].value;
            var parts = val.split('-');
            var result = {
                questionNum : parts[0],
                answerNum : parts[1]
            };
            results.push(result);
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