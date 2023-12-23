// Create constants for the input text box and the box the random words will go in
const inputfield = document.getElementById("inputfield");
const quotebox = document.getElementById("quotebox");
const resetButton = document.getElementById("resetButton");
const timer = document.getElementById("timer");
const rawcpmtext = document.getElementById("rawcpm");
const rawwpmtext = document.getElementById("rawwpm");
const timeOptionDropdown = document.getElementById("time")
const wordlengthOptionDropdown = document.getElementById("wordlength")
const wordcountOptionDropdown = document.getElementById("wordcount")

// Vars for leaderboard modal box
// https://www.w3schools.com/howto/howto_css_modals.asp
const leaderboardModal = document.getElementById("leaderboard-dialog");
const leaderboardOpenButton = document.getElementById("leaderboardOpenButton");
const leaderboardCloseButton = document.getElementById(
  "leaderboardCloseButton"
);

// Add events for buttons to open/close leaderboard box
// https://www.w3schools.com/howto/howto_css_modals.asp
leaderboardOpenButton.addEventListener(
  "click",
  () => (leaderboardModal.style.display = "block")
);
leaderboardCloseButton.addEventListener(
  "click",
  () => (leaderboardModal.style.display = "none")
);

// If user clicks outside of leaderboard box, close it
// https://www.w3schools.com/howto/howto_css_modals.asp
window.addEventListener("click", function (e) {
  if (e.target == leaderboardModal) {
    leaderboardModal.style.display = "none";
  }
});

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
    wordcount: document.getElementById("wordcount").value,
  };
  timer.innerHTML = options.time;
  let wordlist = await createRandomWordList(
    options.wordcount,
    options.wordlength
  );

  let correctCharacterCount = 0;

  // Empty input text box
  inputfield.value = "";
  rawcpmtext.innerHTML = 0;
  rawwpmtext.innerHTML = 0;
  inputfield.disabled = false;
  inputfield.placeholder = "Type here...";
  inputfield.focus();

  // Remove event listener from the text box (since prepareTest() will add a new event listener, we need to prevent having duplicate event listener)
  resetButton.addEventListener(
    "click",
    function handleReset() {
      inputfield.removeEventListener("keydown", handleKeyPress);
    },
    { once: true }
  );
  timeOptionDropdown
    .addEventListener("change", () =>
      inputfield.removeEventListener("keydown", handleKeyPress)
    );
  wordlengthOptionDropdown
    .addEventListener("change", () =>
      inputfield.removeEventListener("keydown", handleKeyPress)
    );
  wordcountOptionDropdown
    .addEventListener("change", () =>
      inputfield.removeEventListener("keydown", handleKeyPress)
    );

  // Populate the quote box with the word list
  populateQuoteBox(wordlist, currentWord, checkWords);

  // Add an event listener to handle keypresses
  inputfield.addEventListener("keydown", handleKeyPress);

  function handleKeyPress(key) {
    // Find which key is being pressed
    let code = key.code;
    let keyCode = key.keyCode;

    // Bool testing whether the key pressed is alphanumeric
    const keyIsAlphanumeric =
      (keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90);
    const keyIsSpace = code === "Space";

    if (keyIsAlphanumeric && !testIsInProgress) {
      // If the key is a number or letter and the test hasn't started yet, start the test
      timerId = startTest();
    } else if (keyIsSpace && !testIsInProgress) {
      key.preventDefault();
      timerId = startTest();
      // If the user typed the word correctly with no mispelling and case-sensitive
      if (inputfield.value == wordlist[currentWord]) {
        checkWords[wordlist[currentWord]] = true;
        correctCharacterCount += wordlist[currentWord].length;
      } else {
        checkWords[wordlist[currentWord]] = false;
      }
      // reset the input text box to blank
      inputfield.value = "";
      currentWord++;
      populateQuoteBox(wordlist, currentWord, checkWords);
    } else if (keyIsSpace && testIsInProgress) {
      // If the key is space (i.e. the user completes the current word being typed) then:
      // Prevent the space from being typed into the box
      key.preventDefault();
      console.log(inputfield.value)

      if (currentWord == wordlist.length - 1) {
        stopTest(timerId);
      }

      // If the user typed the word correctly with no mispelling and case-sensitive
      if (inputfield.value == wordlist[currentWord]) {
        checkWords[wordlist[currentWord]] = true;
        correctCharacterCount += wordlist[currentWord].length;
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

      let updateId = updateStats();

      // Event listener to stop test if reset button is clicked
      resetButton.addEventListener(
        "click",
        () => {
          stopTest(timerId, updateId);
        },
        { once: true }
      );

      timeOptionDropdown.addEventListener('change', () => {
        stopTest(timerId, updateId);
        prepareTest();
      }, {once:true})
      wordcountOptionDropdown.addEventListener('change', () => {
        stopTest(timerId, updateId);
        prepareTest();
      }, {once:true})
      wordlengthOptionDropdown.addEventListener('change', () => {
        stopTest(timerId, updateId);
        prepareTest();
      }, {once:true})



      return timerId;
    }

    function stopTest(timerId, updateId) {
      clearInterval(updateId);
      stopTimer(timerId);
      testIsInProgress = false;
      inputfield.disabled = true;
      inputfield.placeholder = "Test completed";
    }

    function countdownTimer() {
      let timer = document.getElementById("time").value;
      let countDate = new Date().getTime() + timer * 1000;
      let timerId = setInterval(function () {
        let now = new Date().getTime();
        let differenceMS = countDate - now;
        let differenceSec = differenceMS / 1000;

        const timer = document.getElementById("timer");
        if (differenceSec > 0) {
          timer.innerHTML = differenceSec.toFixed(2);
        } else {
          timer.innerHTML = "0.00";

          //https://stackoverflow.com/questions/109086/stop-setinterval-call-in-javascript
          stopTest(timerId);
        }
      });
      return timerId;
    }

    function updateStats() {
      let updateId = setInterval(() => {
        let timeremaining = document.getElementById("timer").innerHTML;
        let timeelapsed = document.getElementById("time").value - timeremaining;
        let rawcpm = (correctCharacterCount / timeelapsed) * 60;
        rawcpmtext.innerHTML = rawcpm.toFixed(2);
        rawwpmtext.innerHTML = (rawcpm / 5).toFixed(2);
        if (timeremaining == 0) {
          clearInterval(updateId);
        }
      }, 200);
      return updateId;
    }
  }
}

function populateQuoteBox(wordlist, currentWord, checkWords) {
  quotebox.innerHTML = "";
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

  let wordListFilterByCharCount = masterWordlist.filter(
    (word) => word.length <= maxCharacterCount && word.length > 0
  );

  //https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array
  let shuffledWordList = wordListFilterByCharCount.sort(
    () => 0.5 - Math.random()
  );

  let wordListSliced = shuffledWordList.slice(0, numberOfWords);

  return wordListSliced;
}
