# Typing Speed Test
#### Video Demo:  <URL HERE>
#### Description:
This web application is an online typing speed test that allows the user to measure their typing speed in words-per-minute and characters-per-minute.
The Typing Speed Test presents the user with a set of random words to type as fast as they can, and measures the user's typing speed in real time. 
The test ends when the user completes typing all of the words, or when the timer runs out. At the end of the test, the user can add their score to a leaderboard that displays the top 10 highest scores.

There are three user-configurable options that change the behavior of the test: time, maximum word length, and word count. The user may change any of the options to suit their preference.

#### Technologies:
1. HTML5
2. CSS
3. Javascript
4. Python
5. Flask
6. sqlite3

The application uses Python and Flask to serve the webpage (index.html). The leaderboard is a local sqlite3 database (leaderboard.db) which contains one table called "leaderboard".  
The frontend is built upon HTML5 and CSS. This is a single-page application, and all of the page content is contained within index.html and styling in styles.css. All of the logic for the typing test is built on client-side Javascript (page.js).

The words generated for each test are randomly selected from a large list of the most commonly-used words (http://www.wordfrequency.info/). The list was manually scrubbed to remove profanity.

