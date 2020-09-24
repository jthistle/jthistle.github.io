
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
  }

  function rebuildDOM() {
    var base = document.getElementById("editQuestions");
    base.textContent = "";
    var i = 0;
    questionsModel.questions.forEach(function (question) {
      if (editing === i) {
        showQuestionEditing(question, base, i);
      } else {
        showQuestion(question, base, i);
      }
      i += 1;
    });
  }

  function saveQuestion(i) {
    questionsModel.questions[i].content = document.getElementById("currentEditing").value;
    editing = -1;
    rebuildDOM();
  }

  function editQuestion(i) {
    if (editing !== -1) {
      saveQuestion(editing);
    }
    editing = i;
    rebuildDOM();
  }

  function deleteQuestion(i) {
    questionsModel.questions.splice(i, 1);
    rebuildDOM();
  }

  function addQuestion() {
    questionsModel.questions.push({
      content: "",
    });
    rebuildDOM();
  }
  
  function addImage(i, e) {
    console.log(e);
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
          var parts = filename.split(".");
          parts[0] += "-1";
          filename = parts.join(".");
        }
        questionsModel.images[filename] = url;
      }

      document.getElementById("currentEditing").value += "\n\n![image](" + filename + ")";
    };
    reader.readAsDataURL(input.files[0]);
  }
  
  return {
    rebuildDOM: rebuildDOM,
    addQuestion: addQuestion,
    deleteQuestion: deleteQuestion,
    editQuestion: editQuestion,
    saveQuestion: saveQuestion,
    addImage: addImage,
  };
}

var build = _build();