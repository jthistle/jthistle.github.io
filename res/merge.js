
function _merge() {
  var mergeOutput;

  function mergeModel(model) {
    console.log(model);
    // Merge images
    for (var imageFilename in model.images) {
      var filenameToUse = imageFilename;
      if (imageFilename in questionsModel.images) {
        if (questionsModel.images[imageFilename] !== model.images[imageFilename]) {
          filenameToUse = build.addFilenameSuffix(imageFilename);
          for (var i = 0; i < model.questions.length; ++i) {
            model.questions[i] = model.questions[i].replace("("+ imageFilename +")", "("+ filenameToUse + ")");
          }
        }
      }

      questionsModel.images[filenameToUse] = model.images[imageFilename];
    }

    // Merge images
    model.questions.forEach(function (question) {
      questionsModel.questions.push(question);
    });

    mergeOutput.textContent = "Successfully merged! You must save the file for the merge to be retained.";
  }

  function openFileEvent(e) {
    var reader = new FileReader();
    reader.onload = function (){
      var txt = decodeURIComponent(reader.result);
      mergeModel(JSON.parse(txt));
    };
    reader.readAsText(e.target.files[0]);
  }

  function finish() {
    build.rebuildDOM();
    main.setView("build");
  }

  window.addEventListener("load", function() {
    console.log("loaded");
    document.getElementById("mergeFileInput").addEventListener("change", function (e) {
      console.log("event!");
      try {
        openFileEvent(e);
      } catch (error) {
        console.error(error);
        mergeOutput.textContent = "Oops, something went wrong";
      }
    });
    mergeOutput = document.getElementById("mergeOutput");
  });

  return {
    finish: finish,
  };
}

var merge = _merge();
