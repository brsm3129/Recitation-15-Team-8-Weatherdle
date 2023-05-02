DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    username VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL
);

DROP TABLE IF EXISTS weather_data CASCADE;
CREATE TABLE weather_data(
    location VARCHAR(50),
    date VARCHAR(50),
    summer_high  FLOAT,
    summer_low FLOAT, 
    summer_longest_day FLOAT,
    winter_high FLOAT,
    winter_low FLOAT,
    winter_longest_day FLOAT
);

DROP TABLE IF EXISTS userdata CASCADE;
CREATE TABLE userdata(
    username VARCHAR(50) PRIMARY KEY, 
    pfp INT,
    streak INT,
    longestStreak INT,
    avgGuess real,
    totalGames INT,
    totalGuesses INT,
    correctGuesses INT
    );

DROP TABLE IF EXISTS guesses CASCADE;
CREATE TABLE guesses(
    username VARCHAR(50) PRIMARY KEY,
    Guess1 VARCHAR(50),
    Guess2 VARCHAR(50),
    Guess3 VARCHAR(50),
    Guess4 VARCHAR(50),
    Guess5 VARCHAR(50),
    Guess6 VARCHAR(50),
    Guess7 VARCHAR(50),
    Guess8 VARCHAR(50)
);