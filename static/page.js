// Create constants for the input text box and the box the random words will go in
const inputfield = document.getElementById("inputfield");
const quotebox = document.getElementById("quotebox");
const resetButton = document.getElementById("resetButton");

// Create an event listener to listen for when the user first begins to type, that triggers the start of the typing test.
inputfield.addEventListener("keydown", handleFirstKeypress);

// Begin the typing test on the first keydown event in the input field.
function handleFirstKeypress(key) {
  let keyCode = key.keyCode;
  let code = key.code;
  const keyIsAlphanumericOrSpace =
    (keyCode >= 48 && keyCode <= 57) ||
    (keyCode >= 65 && keyCode <= 90) ||
    code == "Space";
  if (keyIsAlphanumericOrSpace) {
    startTest();
    inputfield.removeEventListener("keydown", handleFirstKeypress);
  } else return false;
}

function startTest() {
  console.log("test start");
}

preparePage();

async function preparePage() {
  // Call the prepareQuoteBox function and assign its output to an array called words
  let currentWord = 0;
  let checkWords = {};
  let words = await populateQuoteBox(currentWord, checkWords);

  // Add an event listener to listen for when the first word is typed, then start the test and timer
  inputfield.addEventListener("keydown", (key) => {
    // Find which key is being pressed
    let code = key.code;

    // If the key is space (i.e. the user completes the current word being typed) then:
    if (code === "Space") {
      // Prevent the space from being typed into the box
      key.preventDefault();

      // If the user typed the word correctly with no mispelling and case-sensitive
      if (inputfield.value == words[currentWord]) {
        checkWords[words[currentWord]] = true;
      } else {
        checkWords[words[currentWord]] = false;
      }

      // reset the input text box to blank
      inputfield.value = "";
      currentWord++;
      populateQuoteBox(currentWord, checkWords);
    }
  });
}

async function populateQuoteBox(currentWord, checkWords) {
  // Call the fetchRandomWords function and assign its output (list) to a constant named words
  const words = await createWordList();
  quotebox.innerHTML = "";

  // Fill the word box with the random words
  words.forEach((word, index) => {
    const span = document.createElement("span");
    span.textContent = word + " ";
    span.style.paddingLeft = "10px";

    if (index == currentWord) {
      span.style.backgroundColor = "lightblue";
    } else if (checkWords[word]) {
      span.style.backgroundColor = "lightgreen";
    } else if (!checkWords[word] && currentWord > index) {
      span.style.backgroundColor = "pink";
    }
    quotebox.appendChild(span);
  });

  return words;
}

function countdownTimer() {
  var countDate = new Date().getTime() + 6000;
  var x = setInterval(function () {
    var now = new Date().getTime();
    var differenceMS = countDate - now;
    let differenceSec = differenceMS / 1000;

    const timer = document.getElementById("timer");
    if (differenceSec > 0) {
      timer.innerHTML = "Time:" + differenceSec.toFixed(2);
    } else timer.innerHTML = "Time:" + "0.00";
  });
}
// Start countdown
countdownTimer();

async function createWordList() {
  const response = await fetch("/static/wordlist.csv");
  const data = await response.text();

  let wordlist = data.split("\n");
  console.log(wordlist);

  let word_3 = wordlist.filter((word) => word.length <= 7);
  console.log(word_3);

  return word_3.slice(0, 50);
}
createWordList();
