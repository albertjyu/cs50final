### app.py template and initialization from Harvard CS50
import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request
from flask_session import Session

# Configure App
app = Flask(__name__)

# Configure database
db = SQL("sqlite:///leaderboard.db")

@app.route("/")
def index():
    leaderboard = db.execute("SELECT * FROM leaderboard ORDER BY CPM DESC")
    return render_template("index.html", leaderboard=leaderboard)


def insertdb():
    db.execute('INSERT INTO leaderboard (name, wpm, cpm) values (?, ?, ?)', name, wpm, cpm)