// Create constants for the input text box and the box the random words will go in
const inputfield = document.getElementById("inputfield");
const quotebox = document.getElementById("quotebox");

async function prepareQuoteBox() {
  // Get the word list using the fetch function
  fetchRandomWords();
  
  // Fill the quotebox with the word list
  let words = await populateQuote();

  return words;
}

async function fetchRandomWords() {
  const NUMBEROFWORDS = 50;
  //const apiUrl = "https://random-word-api.herokuapp.com/word?number=30";
  const apiUrl =
    "https://api.datamuse.com/words?ml=10+most+common+words+short+Words";

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

async function populateQuote() {
  // Call the fetchRandomWords function and assign its output (list) to a constant named words
  const words = await fetchRandomWords();

  // Fill the word box with the random words
  for (word of words) {
    quotebox.innerHTML = quotebox.innerHTML + " " + word;
  }
  
  return words
}

async function preparePage() {
  // Call the prepareQuoteBox function and assign its output to an array called words
  var words = await prepareQuoteBox();
  var currentWord = 0;

  // Add an event listener to listen for when the first word is typed, then start the test and timer
  inputfield.addEventListener("keydown", (key) => {
    // Find which key is being pressed
    let code = key.code;

    // If the key is space (i.e. the user completes the current word being typed) then:
    if (code === "Space") {
      key.preventDefault(); // Prevent the space from being typed into the box

      // If the user typed the word correctly with no mispelling and case-sensitive
      console.log(inputfield.value);
      if (inputfield.value == words[currentWord]) {
        quotebox.style.backgroundColor = "green";
      } else quotebox.style.backgroundColor = "red";

      // reset the input text box to blank
      inputfield.value = "";
      currentWord++;
    }
  });
}
preparePage();
