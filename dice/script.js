
var dies = [];

function onReady() {
  for (var i = 0; i < 100; ++i) {
    var test_die = Die();
    dies.push(test_die);
  }

  roll();

  document.getElementById("rollBtn").addEventListener("click", roll);
  document.getElementById("removeBtn").addEventListener("click", removeSixes);

  console.log("Hello :)");
  console.log("Follow me on GitHub: https://github.com/jthistle");
}


function roll() {
  dies.forEach(function (d) {
    d.setPosition([window.innerWidth / 2, -150]);
  });

  dies.forEach(function (d) {
    d.roll();
  })
  
  setTimeout(arrange, 5000);
}


function arrange() {
  var initX = 50;
  var initY = 50;

  var x = initX;
  var y = initY;
  var maxX = window.innerWidth - 100;

  var gridSize = window.screen.width < 640 ? 50 : 50;
  
  dies.forEach(function (d) {
    if (x > maxX) {
      x = initX;
      y += gridSize;
    }

    d.moveTo([x, y], 1000);
    d.straighten(1000);
    x += gridSize;
  });
}


function removeSixes() {
  for (var i = dies.length - 1; i > -1; --i) {
    var d = dies[i];
    if (d.getValue() == 6) {
      d.moveTo([200, -200]);
      dies.splice(i, 1);
    }
  }
}


function randint(a, b) {
  return a + Math.floor(
    Math.random() * (b - a)
  );
}


/**
 * Lerping stuff
 */
function interpolate(a, b, t) {
  if (typeof(a) !== typeof(b)) {
    console.log(a, b);
    console.error("lerp: types don't match!");
    return b;
  }

  var p = (-2 * Math.pow(t, 3) + 3 * Math.pow(t, 2));

  if (typeof(a) == "number") {
    return a + (b - a) * p; 
  } else if (Array.isArray(a)) {
    return b.map(
      function (v, i) {
        return a[i] + (v - a[i]) * p;
      }
    );
  }

  console.error("lerp: unsupported type " + typeof(a));
  return b;
}

function slerp(callback, a, b, t) {
  var total = 0;
  var handle = setInterval(function() {
    callback(
      interpolate(a, b, total / t)
    );

    total += 10;
    if (total >= t) {
      clearInterval(handle);
      callback(b);
    }
  }, 15);
}


function animate(callback, duration, interval, onFinish) {
  var total = 0;
  var handle = setInterval(
    function () {
      callback();
      total += interval;
      if (total >= duration) {
        clearInterval(handle);
        onFinish();
      }
    },
    interval
  );
}


/**
 * Morbid class
 */
function Die() {
  var position = [0, 0];
  var value = 1;
  var rotation = 0;

  var node = document.createElement("div");
  node.classList.add("die");
  document.getElementById("main").appendChild(node);

  updateDisplay();

  function roll() {
    var duration = randint(1500, 2250);

    var newPos = [
      randint(100, window.innerWidth - 100),
      randint(100, window.innerHeight - 100),
    ];
    moveTo(newPos, duration);
    animate(rollAnim, duration, 150, function () {
      value = randint(1, 7);
      updateDisplay();  
    });

    var newRot = randint(180, 720);
    slerp(updateRotation, rotation, newRot, duration);
    rotation = newRot;
  }

  function rollAnim() {
    var val = Math.floor(Math.random() * 6) + 1;
    setImage(val);
  }

  function updateDisplay() {
    setImage(value);
  }

  function setImage(val) {
    node.style.backgroundImage = "url(die" + val + ".png)";
  }

  function moveTo(newPos, duration) {
    slerp(updatePos, position, newPos, duration || 500);
    position = newPos;
  }
  
  function updatePos(newPos) {
    node.style.left = newPos[0];
    node.style.top = newPos[1];
  }

  function updateRotation(newRot) {
    node.style.transform = "rotate(" + newRot + "deg)";
  }

  function straighten(duration) {
    slerp(updateRotation, rotation, 0, duration || 1000);
    rotation = 0;
  }
  
  return {
    roll: roll,
    moveTo: moveTo,
    setPosition: function (newPos) {
      position = newPos;
      updatePos(newPos);
    },
    straighten: straighten,
    getValue: function () { return value; }
  };
}


window.addEventListener("load", onReady);