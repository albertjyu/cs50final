### app.py template and initialization from Harvard CS50
import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request
from flask_session import Session

# Configure App
app = Flask(__name__)

# Configure database
db = SQL("sqlite:///leaderboard.db")

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        name = request.form.get("name")
        wpm = float(request.form.get("wpm"))
        cpm = round(wpm * 5, 2)
        db.execute('INSERT INTO leaderboard (name, wpm, cpm) values (?, ?, ?)', name, wpm, cpm)
        return redirect("/")
    
    else:
        leaderboard = db.execute("SELECT * FROM leaderboard ORDER BY CPM DESC LIMIT 20")
        print("test")
        return render_template("index.html", leaderboard=leaderboard)