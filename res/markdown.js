
function _markdown() {
  var bold_re = /(?:\*\*(.*?)\*\*)|(?:__(.*?)__)/gi;
  var italic_re = /(?:\*(.*?)\*)|(?:_(.*?)_)/gi;
  var image_re = /!\[([^\]\n]*)\]\(([^\)\n]+)\)/gi;
  var linebr_re = /n\n+/gi;
  var ul_re = /\n((?:[-*]\s.*?\n)+)/gi;
  var ul_li_re = /\n\s*[-*]\s(.*)/gi;
  var ol_re = /\n((?:\d\.\s.*?\n)+)/gi;
  var ol_li_re = /\n\s*\d\.\s(.*)/gi;

  function parseToHTML(src) {
    var replace = [];
    var match;
    while (match = image_re.exec(src)) {
      console.log("match", match);

      var raw = questionsModel.images[match[2]];

      var replacement = '<img alt="' + match[1] + '" src="'+ (raw || "") +'" />';
      replace.push({
        span: [match.index, match.index + match[0].length],
        new: replacement
      });
    }

    var sanitised = "\n" + src;
    replace.reverse();
    replace.forEach(function (replacement) {
      sanitised = sanitised.substring(0, replacement.span[0]) + replacement.new + sanitised.substring(replacement.span[1] + 1, sanitised.length);
    });

    sanitised = sanitised.replace(ul_re, "<ul>\n$1</ul>");
    sanitised = sanitised.replace(ul_li_re, "<li>$1</li>");

    sanitised = sanitised.replace(ol_re, "<ol>\n$1</ol>");
    sanitised = sanitised.replace(ol_li_re, "<li>$1</li>");

    sanitised = "<p>" + sanitised;
    sanitised = sanitised.replace(linebr_re, "</p><p>");
    sanitised += "</p>"

    sanitised = sanitised.replace(bold_re, "<b>$1$2</b>");
    sanitised = sanitised.replace(italic_re, "<i>$1$2</i>");

    return sanitised;
  }

  return {
    parseToHTML: parseToHTML
  };
}

var markdown = _markdown();
