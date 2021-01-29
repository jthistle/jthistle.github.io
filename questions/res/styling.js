
function _styling() {
  var bgdPickr, textColourPickr;

  function getPickrOptions(el, defaultColour) {
    return {
      el: el,
      theme: 'nano',
      comparison: false,
      default: defaultColour,
      defaultRepresentation: 'HEX',
      components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
          input: true,
        }
      }
    }
  }
  
  window.addEventListener("load", function(){
    if (!questionsModel.styling.hasOwnProperty("question")) {
      questionsModel.styling.question = {};
    }
    
    var sampleQuestion = document.getElementById("sampleQuestion");

    bgdPickr = new Pickr(getPickrOptions("#backgroundColourSelector", "#ffffff"));

    bgdPickr.on('change', function (colour, instance) {
      var val = colour.toHEXA().toString();
      questionsModel.styling.question.backgroundColor = val;
      main.applyStyles(sampleQuestion);
    });

    textColourPickr = new Pickr(getPickrOptions("#textColourSelector", "#000000"));
    textColourPickr.on('change', function (colour, instance) {
      var val = colour.toHEXA().toString();
      questionsModel.styling.question.color = val;
      main.applyStyles(sampleQuestion);
    });

    document.getElementById("fontSizeSlider").addEventListener("input", function (e) {
      questionsModel.styling.question.fontSize = e.target.value + "pt";
      main.applyStyles(sampleQuestion);
    });
  });

  function finished() {
    build.rebuildDOM();
    picker.resetHistory();
    main.setView("build");
  }

  function reset() {
    bgdPickr.setColor(questionsModel.styling.question.backgroundColor || "#ffffff");
    textColourPickr.setColor(questionsModel.styling.question.color || "#000000");
    var fontSize = questionsModel.styling.question.fontSize || "14pt";
    document.getElementById("fontSizeSlider").value = fontSize.slice(0, fontSize.length - 2);
    main.applyStyles(sampleQuestion);
  }

  return {
    finished: finished,
    reset: reset,
  };
}

var styling = _styling();
