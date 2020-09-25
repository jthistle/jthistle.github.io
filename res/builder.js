
function _build() {
  var editing = -1;

  function showQuestion(question, base, i) {
    var newQ = document.createElement("div");
    newQ.id = "question" + i;
    newQ.classList.add("question");
    base.appendChild(newQ);

    newQ.innerHTML = markdown.parseToHTML(question.content);

    var buttons = document.createElement("div");
    buttons.classList.add("questionToolbar");
    newQ.appendChild(buttons);

    var editBtn = document.createElement("button");
    editBtn.setAttribute("onclick", "build.editQuestion("+ i +")");
    editBtn.textContent = "Edit Question"
    buttons.appendChild(editBtn);

    var deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("onclick", "build.deleteQuestion("+ i +")");
    deleteBtn.textContent = "Delete Question"
    deleteBtn.classList.add("delete");
    buttons.appendChild(deleteBtn);

    return newQ;
  }

  function showQuestionEditing(question, base, i) {
    var newQ = document.createElement("div");
    newQ.id = "question" + i;
    newQ.classList.add("question");
    base.appendChild(newQ);

    var area = document.createElement("textarea");
    area.id = "currentEditing";
    area.value = question.content;
    newQ.appendChild(area);

    var buttons = document.createElement("div");
    buttons.classList.add("questionToolbar");
    newQ.appendChild(buttons);

    var editBtn = document.createElement("button");
    editBtn.setAttribute("onclick", "build.saveQuestion("+ i +")");
    editBtn.textContent = "Save Question"
    buttons.appendChild(editBtn);

    var addImg = document.createElement("input");
    addImg.setAttribute("type", "file");
    addImg.addEventListener("change", function (e) { 
      build.addImage(i, e);
    });
    addImg.id = "addImg";
    addImg.style = "display: none;"
    buttons.appendChild(addImg);

    var addImgBtn = document.createElement("button");
    addImgBtn.setAttribute("onclick", "document.getElementById('addImg').click()");
    addImgBtn.textContent = "Add Image";
    buttons.appendChild(addImgBtn);

    return newQ;
  }

  function rebuildDOM() {
    var base = document.getElementById("editQuestions");
    base.textContent = "";
    var i = 0;
    questionsModel.questions.forEach(function (question) {
      var q;
      if (editing === i) {
        q = showQuestionEditing(question, base, i);
      } else {
        q = showQuestion(question, base, i);
      }

      main.applyStyles(q);
      
      i += 1;
    });
  }

  function saveQuestion(i) {
    questionsModel.questions[i].content = document.getElementById("currentEditing").value;
    editing = -1;
    rebuildDOM();
    picker.resetHistory();
  }

  function editQuestion(i) {
    if (editing !== -1) {
      saveQuestion(editing);
    }
    editing = i;
    rebuildDOM();
    document.getElementById("currentEditing").focus();
  }

  function deleteQuestion(i) {
    questionsModel.questions.splice(i, 1);
    rebuildDOM();
    picker.resetHistory();
  }

  function addQuestion() {
    questionsModel.questions.push({
      content: "",
    });
    editQuestion(questionsModel.questions.length - 1);
  }
  
  function addImage(i, e) {
    var input = e.target;
    var reader = new FileReader();
    reader.onload = function (){
      var url = reader.result;

      var parts = e.target.value.split("\\");
      if (parts.length === 1) {
        parts = url.split("/");
      }
      var filename = parts[parts.length - 1];
      
      // Check for image existing in repository
      var found = false;
      var foundMatch = false;
      for (var i = 0; i < questionsModel.images.length; ++i) {
        var image = questionsModel.images[i];
        if (image.filename === filename) {
          var found = true;
          if (image.raw === url) {
            var foundMatch = true;
          }
          break;
        }
      }

      if (!foundMatch) {
        if (found) {
          // Add -1 to end of filename if name is duplicated
          filename = addFilenameSuffix(filename);
        }
        questionsModel.images[filename] = url;
      }

      var textarea = document.getElementById("currentEditing");
      var val = textarea.value;
      val = val.slice(0, textarea.selectionStart + 1) + "\n![image](" + filename + ")\n" + val.slice(textarea.selectionStart + 1, val.length - 1);
      textarea.value = val;
    };
    reader.readAsDataURL(input.files[0]);
  }

  function addFilenameSuffix(filename) {
    var parts = filename.split(".");
    parts[0] += "-1";
    return parts.join(".");
  }
  
  return {
    rebuildDOM: rebuildDOM,
    addQuestion: addQuestion,
    deleteQuestion: deleteQuestion,
    editQuestion: editQuestion,
    saveQuestion: saveQuestion,
    addImage: addImage,
    addFilenameSuffix: addFilenameSuffix,
  };
}

var build = _build();