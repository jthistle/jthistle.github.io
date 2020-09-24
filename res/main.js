

var questionsModel = {
  styling: {},
  questions: [
    {
      content: "test question\n1. free food\n2. free beer\n\n- cheese\n- cake\n",
    }
  ],
  // Images are stored an object with the key as the filename and the value as the raw image
  images: {},
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
  }
  
  function newQuestionPack() {
    setView("build");
    build.rebuildDOM();
  }

  return {
    setView: setView,
    loadQuestionsFile: loadQuestionsFile,
    newQuestionPack: newQuestionPack,
  };
}

var main = _main();

window.onload = function () {
  main.setView("start");
}
