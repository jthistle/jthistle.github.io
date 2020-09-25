

var questionsModel = {
  styling: {},
  questions: [
    {
      content: "test question\n1. free food\n2. free beer\n\n- cheese\n- cake\n",
    }
  ],
  // Images are stored an object with the key as the filename and the value as the raw image
  images: {},
  version: 1,
}

function _main() {
  var VIEWS = ["start", "run", "build"];

  function setView(newView) {
    VIEWS.forEach(function (view) {
      document.getElementById(view).classList.remove("hidden");
      if (view !== newView) {
        document.getElementById(view).classList.add("hidden");
      }
    });
  }

  function loadQuestionsFile(e) {
    console.log(e);
    var reader = new FileReader();
    reader.onload = function (){
      var txt = decodeURIComponent(reader.result);
      questionsModel = JSON.parse(txt);
      setView('run');
      build.rebuildDOM();
      picker.resetHistory();
    };
    reader.readAsText(e.target.files[0]);
  }
  
  function newQuestionPack() {
    setView("build");
    build.rebuildDOM();
    picker.resetHistory();
  }

  function saveQuestions() {
    var downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(questionsModel)));
    downloadLink.setAttribute("download", "my-questions.json");

    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    downloadLink.click();

    document.body.removeChild(downloadLink);
  }

  return {
    setView: setView,
    loadQuestionsFile: loadQuestionsFile,
    newQuestionPack: newQuestionPack,
    saveQuestions: saveQuestions,
  };
}

var main = _main();

window.onload = function () {
  main.setView("start");
  document.getElementById("questionLoader").addEventListener("change", function (e) { 
    main.loadQuestionsFile(e);
  });
}
