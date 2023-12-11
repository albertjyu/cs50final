// Create constants for the input text box and the box the random words will go in
const inputfield = document.getElementById("inputfield");
const quotebox = document.getElementById("quotebox");
const resetButton = document.getElementById("resetButton");

preparePage();

async function preparePage() {
  // Call the prepareQuoteBox function and assign its output to an array called words
  let currentWord = 0;
  currentWord = 0;
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
      console.log(inputfield.value);
      console.log(words[currentWord])
      if (inputfield.value == words[currentWord]) {
        checkWords[words[currentWord]] = true;
        console.log('success')
      } else {
        checkWords[words[currentWord]] = false;
        console.log('fail')
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
  const words = await fetchRandomWords();
  quotebox.innerHTML = "";

  // Fill the word box with the random words
  let index = 0;
  for (word of words) {
    const span = document.createElement("span");
    span.textContent = word + " ";

    if (index == currentWord) {
      span.style.backgroundColor = "lightblue";
    } else if (checkWords[word]) {
      span.style.backgroundColor = "lightgreen";
    } else if (!checkWords[word] && currentWord > index) {
      span.style.backgroundColor = "pink";
    }
    quotebox.appendChild(span);
    index++;
  }

  return words;
}

async function fetchRandomWords() {
  const NUMBEROFWORDS = 50;
  //const apiUrl = "https://random-word-api.herokuapp.com/word?number=30";
  const apiUrl = "https://api.datamuse.com/words?ml=duck&sp=b*&max=10";

  // Set variables for the async fetch request
  const response = await fetch(apiUrl);
  const data = await response.json();

  // Process the response and turn the data into an object
  const wordsObject = data.reduce((obj, { word }) => {
    obj[word] = true;
    return obj;
  }, {});

  // return just the keys as a list
  return Object.keys(wordsObject);
}
