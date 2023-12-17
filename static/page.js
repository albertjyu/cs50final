// Create constants for the input text box and the box the random words will go in
const inputfield = document.getElementById("inputfield");
const quotebox = document.getElementById("quotebox");
const resetButton = document.getElementById("resetButton");
const timer = document.getElementById("timer");

// When page loads, prepare the page for a typing test
prepareTest();

async function prepareTest() {
  // Initialize variables for the typing test
  let currentWord = 0;
  let checkWords = {};
  let testIsInProgress = false;
  let timerId;
  let options = {
    time: document.getElementById("time").value,
    wordlength: document.getElementById("wordlength").value,
    wordcount: document.getElementById("wordcount").value
  }
  let wordlist = await createRandomWordList(options.wordcount, options.wordlength);
  
  // Empty input text box
  inputfield.value = "";
  inputfield.focus();

  // Remove event listener from the text box (since prepareTest() will add a new event listener, we need to prevent having duplicate event listener)
  resetButton.addEventListener("click", () => inputfield.removeEventListener("keydown", handleKeyPress));
  document.getElementById("wordlength").addEventListener("change", () => inputfield.removeEventListener("keydown", handleKeyPress));
  document.getElementById("wordcount").addEventListener("change", () => inputfield.removeEventListener("keydown", handleKeyPress));

  // Populate the quote box with the word list
  populateQuoteBox(wordlist, currentWord, checkWords);

  // Add an event listener to handle keypresses
  inputfield.addEventListener("keydown", handleKeyPress);

  function handleKeyPress(key) {
    console.log(timer.value)
    
    // Find which key is being pressed
    let code = key.code;
    let keyCode = key.keyCode;

    // Bool testing whether the key pressed is alphanumeric
    const keyIsAlphanumeric =
      (keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90);
    const keyIsSpace = code === "Space";

    if (keyIsAlphanumeric && !testIsInProgress) {
      // If the key is a number or letter and the test hasn't started yet, start the test
      console.log("alphanumeric");
      timerId = startTest();
    } else if (keyIsSpace && !testIsInProgress) {
      key.preventDefault();
      timerId = startTest();
      // If the user typed the word correctly with no mispelling and case-sensitive
      if (inputfield.value == words[currentWord]) {
        checkWords[words[currentWord]] = true;
      } else {
        checkWords[words[currentWord]] = false;
      }
      // reset the input text box to blank
      inputfield.value = "";
      currentWord++;
      populateQuoteBox(wordlist, currentWord, checkWords);
    } else if (code === "Space" && testIsInProgress) {
      // If the key is space (i.e. the user completes the current word being typed) then:
      // Prevent the space from being typed into the box
      key.preventDefault();

      if (currentWord == wordlist.length - 1) {
        stopTest(timerId);
      }

      // If the user typed the word correctly with no mispelling and case-sensitive
      if (inputfield.value == wordlist[currentWord]) {
        checkWords[wordlist[currentWord]] = true;
      } else {
        checkWords[wordlist[currentWord]] = false;
      }

      // reset the input text box to blank
      inputfield.value = "";
      currentWord++;
      populateQuoteBox(wordlist, currentWord, checkWords);
    }

    function startTest() {
      // Set test in progress
      testIsInProgress = true;

      // Start countdown
      let timerId = countdownTimer();
      console.log("test start");
      return timerId;
    }

    function stopTest(timerId) {
      stopTimer(timerId);
    }
  }
}

function populateQuoteBox(wordlist, currentWord, checkWords) {
  quotebox.innerHTML = "";
  console.log(checkWords);
  // Fill the word box with the random words
  wordlist.forEach((word, index) => {
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

  return wordlist;
}

function stopTimer(timerId) {
  clearInterval(timerId);
}

function countdownTimer() {
  let time = document.getElementById("time").value
  var countDate = new Date().getTime() + time * 1000;
  var timerId = setInterval(function () {
    var now = new Date().getTime();
    var differenceMS = countDate - now;
    let differenceSec = differenceMS / 1000;

    const timer = document.getElementById("timer");
    if (differenceSec > 0) {
      timer.innerHTML = differenceSec.toFixed(2);
    } else {
      timer.innerHTML = "0.00";
      clearInterval(timerId);
    }
  });
  return timerId;
}

async function createMasterWordList() {
  // Use fetch to load in the wordlist CSV file
  const response = await fetch("/static/wordlist.csv");
  const data = await response.text();

  // Split the CSV data by newline to create an array of words.
  let wordlist = data.split("\n");

  // return the masterwordlist (slice the first string since it's the URL source in the CSV)
  return wordlist.slice(1);
}

async function createRandomWordList(numberOfWords, maxCharacterCount) {
  const masterWordlist = await createMasterWordList();

  let wordListFilterByCharCount = masterWordlist.filter((word) => word.length <= maxCharacterCount);
  let shuffledWordList = wordListFilterByCharCount.sort(() => 0.5 - Math.random());
  
  let wordListSliced = shuffledWordList.slice(0, numberOfWords);

  return wordListSliced;
}
