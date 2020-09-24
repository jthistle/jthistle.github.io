var questionCount = 0;

function hideQuestions() {
    for (var i = 0; i < questionCount; i++) {
        var question = document.getElementById("question" + i);
        question.classList.remove("shown");
        question.classList.add("hidden");
    }
}

function chooseRandom() {
    hideQuestions();
    var chosen = [];
    
    var reqNum = document.getElementById("qcount").value;
    var numQuestions = Math.min(reqNum, questionCount);
    while (numQuestions > 0) {
        var i = Math.floor(Math.random() * questionCount);
        if (chosen.indexOf(i) !== -1) {
            continue;
        }
        var question = document.getElementById("question" + i);
        console.log(i);
        question.classList.add("shown");
        question.classList.remove("hidden");
        numQuestions -= 1;
        chosen.push(i);
    }
}
