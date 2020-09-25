var questionCount = 0;

function _picker() {
  var history = [];
  
  function showQuestion(i) {
    var question = questionsModel.questions[i];
    var base = document.getElementById("questions");
    base.textContent = "";

    var newQ = document.createElement("div");
    newQ.id = "question" + i;
    newQ.classList.add("question");
    base.appendChild(newQ);

    newQ.innerHTML = markdown.parseToHTML(question.content);

    main.applyStyles(newQ);
  }
  
  function nextQuestion() {
    if (history.length == questionsModel.questions.length) {
      document.getElementById("outOfQs").textContent = "No more questions!";
      return;
    }

    while (true) {
      var n = Math.floor(Math.random() * questionsModel.questions.length);
      
      var alreadyDone = false;
      for (var i = 0; i < history.length; ++i) {
        if (history[i] == n) {
          var alreadyDone = true;
          break;
        }
      }
      if (!alreadyDone) {
        break;
      }
    }

    history.push(n);
    console.log(n);
    showQuestion(n);
  }

  function resetHistory() {
    history = [];
    document.getElementById("outOfQs").textContent = "";
    nextQuestion();
  }
  
  return {
    nextQuestion: nextQuestion,
    resetHistory: resetHistory,
  };
}

var picker = _picker();
