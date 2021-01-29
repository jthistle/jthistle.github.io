

var questionsModel = {
  styling: {},
  questions: [
    {
      content: "test question\n1. free food\n2. free beer\n\n- cheese\n- cake\n",
    }
  ],
  // Images are stored an object with the key as the filename and the value as the raw image
  images: {},
  meta: {
    name: "question pack",
  },
  version: 1,
}

function _main() {
  var VIEWS = ["start", "run", "build", "styling", "merge"];

  function setView(newView) {
    VIEWS.forEach(function (view) {
      document.getElementById(view).classList.remove("hidden");
      if (view !== newView) {
        document.getElementById(view).classList.add("hidden");
      }
    });
  }

  function loadQuestionsFile(e) {
    var reader = new FileReader();
    reader.onload = function (){
      var txt = decodeURIComponent(reader.result);
      questionsModel = JSON.parse(txt);
      updateName();
      setView('run');
      build.rebuildDOM();
      picker.resetHistory();
      styling.reset();
    };
    reader.readAsText(e.target.files[0]);
  }
  
  function newQuestionPack() {
    questionsModel.meta.name = document.getElementById("packName").value.slice(0, 64);   // don't let name get too long
    if (questionsModel.meta.name.trim() === "") {
      return;
    }
    updateName();
    setView("build");
    build.rebuildDOM();
    picker.resetHistory();
  }

  function updateName() {
    document.getElementsByClassName("replacePackName").forEach(function (el) {
      el.textContent = questionsModel.meta.name;
    });
  }

  var sanitise_re = /[^a-z0-9_]/gi
  function saveQuestions() {
    var data = JSON.stringify(questionsModel);
    var filename = questionsModel.meta.name.replace(sanitise_re, "-") + ".json";

    // IE and Edge compat
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(new Blob([data], {type: "text/plain"}), filename);
      return;
    } 

    var downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(data));
    downloadLink.setAttribute("download", filename);

    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    downloadLink.click();

    document.body.removeChild(downloadLink);
  }

  function applyStyles(el) {
    for (var prop in questionsModel.styling.question) {
      el.style[prop] = questionsModel.styling.question[prop];
    }
  }

  return {
    setView: setView,
    loadQuestionsFile: loadQuestionsFile,
    newQuestionPack: newQuestionPack,
    saveQuestions: saveQuestions,
    applyStyles: applyStyles,
  };
}

var main = _main();

window.addEventListener("load", function () {
  main.setView("start");
  document.getElementById("questionLoader").addEventListener("change", function (e) { 
    main.loadQuestionsFile(e);
  });
});
