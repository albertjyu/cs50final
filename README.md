# Typing Speed Test
#### Video Demo:  <https://www.youtube.com/watch?v=Q0qa2jFLgTA>
#### Description:
This web application is an online typing speed test that allows the user to measure their typing speed in words-per-minute and characters-per-minute.
The Typing Speed Test presents the user with a set of random words to type as fast as they can, and measures the user's typing speed in real time. 
The test ends when the user completes typing all of the words, or when the timer runs out. At the end of the test, the user can add their score to a leaderboard that displays the top 10 highest scores.

There are three user-configurable options that change the behavior of the test: time, maximum word length, and word count. The user may change any of the options to suit their preference.

The application uses Python and Flask to serve the webpage (index.html). The leaderboard is a local sqlite3 database (leaderboard.db) which contains one table called "leaderboard". Leaderboard entries are handled through a POST request within the leaderboard modal dialog box. The name entered by the user is passed to the backend which enters the name, score, and timestamp of the entry into the sqlite3 database.

The frontend is built upon HTML5 and CSS. This is a single-page application, and all of the page content is contained within index.html and styling in styles.css. The design of the page is meant to be minimal and clean, using simple fonts and styling for all of the page elements. 

All of the logic for the typing test is built on client-side Javascript (page.js). The page.js file contains all of the functions needed to run the typing test, check whether the words typed are correct/incorrect, keep track of the test time, render the randomized word list, calculate the WPM/CPM, etc. It also handles the user-configurable options. 

The application makes great use of Javascript event handlers. For example, the input field that the user types words in has an event handler that detects when an alphabet key is pressed to begin the test. It also detects when the space bar is pressed, to move onto the next word.

Throughout the duration of the test, the user's correct/incorrect word entries are kept track of in a Javascript object (which acts as a hashmap) that stores the word and whether it was typed correctly or incorrectly as a key-value pair. Then, each time the user moves to the next word, the page uses the hashmap to render the word list with either green or red highlighting to indicate whether the word was typed correctly or not. 

The words generated for each test are randomly selected from a large list of the most commonly-used words (http://www.wordfrequency.info/). The list was manually scrubbed to remove profanity.

#### Technologies:
1. HTML5
2. CSS
3. Javascript
4. Python
5. Flask
6. sqlite3



